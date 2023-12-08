const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

class ExtractSassVarsPlugin {
  constructor(options) {
    this.options = options;
    this.variablesMap = {};
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('ExtractSassVarsPlugin', (compilation, callback) => {
      const buildFolder = path.join(compiler.outputPath, 'themes/_build');
      
      if (!fs.existsSync(buildFolder)) {
        console.error('文件或文件夹不存在');
        callback();
        return
      }
      
      // 获取_build文件夹下的所有文件
      const jsonFiles = fs.readdirSync(buildFolder).filter(file => file.endsWith('.json'));
      
      // 合并所有JSON文件的内容
      const mergedJson = {};
      jsonFiles.forEach(jsonFile => {
        const jsonFilePath = path.join(buildFolder, jsonFile);
        const jsonContent = require(jsonFilePath); // 或者使用JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        Object.assign(mergedJson, jsonContent);
      });
      
      // 将内容写入文件
      const outputJsonPath = path.join(compiler.outputPath, 'themes/theme.json');
      fs.writeFileSync(outputJsonPath, JSON.stringify(mergedJson, null, 2), 'utf-8');
      
      const outputCssPath = path.join(compiler.outputPath, 'themes/themes.css');
      const themeJsonDir = this.options.themeJsonDir
      if (themeJsonDir && fs.existsSync(themeJsonDir)) {
        const themeJsonFiles = fs.readdirSync(themeJsonDir).filter(file => file.endsWith('.json'));
        let cssContent = '';
        themeJsonFiles.forEach(file => {
          const themeJsonPath = path.join(themeJsonDir, file);
          const filename = path.basename(themeJsonPath, '.json');
          if (fs.existsSync(themeJsonPath)) {
            const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
            const content = (Object.keys(themeJson)
              .map(key => `  ${key}: ${themeJson[key]};`)
              .join('\n'));
            cssContent += `:root[theme=${filename}] {\n${content}\n}\n`;
          }
        })
        fs.writeFileSync(outputCssPath, cssContent, 'utf-8');
      } else {
        console.warn('themeJsonDir不存在，将不会生成主题css文件！')
      }

      // 删除_build文件夹
      rimraf.sync(buildFolder);

      callback();
    })
  }
}

ExtractSassVarsPlugin.loader = require.resolve('./loader');

module.exports = ExtractSassVarsPlugin;
