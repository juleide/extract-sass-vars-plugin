const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getThemeExtractLinkTag({ publicPath, options }) {
  const filename = 'themes';
  let href = `/${publicPath || ''}/${filename}.css`.replace(/\/+(?=\/)/g, '');
  return {
    tagName: 'link',
    voidTag: true,
    attributes: {
      href,
      rel: 'stylesheet',
      id: options.themeLinkTagId || 'theme-link-tag',
    },
  };
}

function addDefaultThemeToHtml(html, defaultTheme) {
  let newHtml = html;
  const htmlTagAttrStrings = html.match(/<\s*html[^<>]*>/gi) || [];

  htmlTagAttrStrings.forEach((attrstr) => {
      const datathemeStrings = attrstr.match(/data\-theme\s*=['"].+['"]/g);
      if (datathemeStrings) {
          datathemeStrings.forEach((themestr) => {
              const datathemeStr = themestr.replace(
                  /(^data\-theme\s*=['"]|['"]$)/g,
                  ''
              );
              const datathemes = datathemeStr.split(' ');
              if (!datathemes.includes(defaultTheme)) {
                  datathemes.push(defaultTheme);
                  newHtml = newHtml.replace(
                      attrstr,
                      attrstr.replace(
                          themestr,
                          themestr.replace(datathemeStr, datathemes.join(' '))
                      )
                  );
              }
          });
      } else {
          newHtml = newHtml.replace(
              attrstr,
              `${attrstr.replace(/>$/, '')} data-theme="${defaultTheme}">`
          );
      }
  });
  return newHtml;
}

class ExtractSassVarsPlugin {
  constructor(options) {
    this.options = options || {};
    this.themes = this.options.themes || [];
    this.options.defaultTheme = this.options.defaultTheme ||
      (this.themes.length ? this.themes[0].name : 'light');
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ExtractSassVarsPlugin', compilation => {
      let publicPath = this.options.publicPath;
      if (typeof HtmlWebpackPlugin.getHooks !== 'function') {
        if (!publicPath) {
          compilation.plugin(
            'html-webpack-plugin-before-html-generation',
            (data) => {
              const { publicPath: path } = data.assets || {};
              publicPath = path;
            }
          );
        }
        compilation.plugin(
          'html-webpack-plugin-alter-asset-tags',
          (data) => {
            // 添加默认主题link标签
            const themeLinkTag = [
              getThemeExtractLinkTag({
                publicPath,
                options: this.options,
              }),
            ];
            data.head = themeLinkTag.concat(data.head);
          }
        );
        compilation.plugin(
          'html-webpack-plugin-before-html-processing',
          (data) => {
            data.html = addDefaultThemeToHtml(
              data.html,
              this.options.defaultTheme
            );
          }
        );
        return
      }
      const htmlWebpackCompilation = HtmlWebpackPlugin.getHooks(compilation);
      if (!publicPath) {
        // 未指定publicPath时，取html-webpack-plugin解析后的publicPath
        htmlWebpackCompilation.beforeAssetTagGeneration.tapAsync(
          'ExtractSassVarsPlugin',
          (data, cb) => {
            const { publicPath: path } = data.assets || {};
            publicPath = path;
            cb(null, data);
          }
        );
      }
      htmlWebpackCompilation.alterAssetTags.tapAsync(
        'ExtractSassVarsPlugin',
        (data, cb) => {
          // 添加默认主题link标签
          const themeLinkTag = [
            getThemeExtractLinkTag({
              publicPath,
              options: this.options,
            }),
          ];
          data.assetTags.styles = themeLinkTag.concat(data.assetTags.styles);
          cb(null, data);
        }
      );
      htmlWebpackCompilation.beforeEmit.tapAsync(
        'ExtractSassVarsPlugin',
        (data, cb) => {
          data.html = addDefaultThemeToHtml(
            data.html,
            this.options.defaultTheme
          );
          cb(null, data);
        }
      );
    })

    compiler.hooks.emit.tapAsync(
      'ExtractSassVarsPlugin',
      async (compilation, callback) => {
        const outputCssPath = 'themes.css'
        let cssContent = '';
        if (this.themes.length) {
          for await(const file of this.themes) {
            const themeJsonPath = path.resolve(__dirname, file.path);
            const filename = file.name;
            if (fs.existsSync(themeJsonPath)) {
              const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
              const content = (Object.keys(themeJson)
                .map(key => `  --hz-${key}: ${themeJson[key]};`)
                .join('\n'));
              cssContent += `:root[data-theme=${filename}] {\n${content}\n}\n`;
            }
          }
          compilation.assets[
            `${outputCssPath}`
          ] = {
            source() {
              return cssContent;
            },
            size() {
              return cssContent.length;
            },
          };
          callback()
        } else {
          console.error(new Error('未设置themes字段，将不会生成主题css！'));
          callback();
        }
      }
    );
  }
}

ExtractSassVarsPlugin.loader = require.resolve('./loader');

module.exports = ExtractSassVarsPlugin;
