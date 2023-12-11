const fs = require('fs');
const path = require('path');

function loader(content) {
  const callback = this.async()
  const { emitWarning } = this;
  const options = this.query || {};
  const prefix = options.prefix || 'hz';
  const themes = options.themes || [];
  if (!themes.length) {
    emitWarning(new Error('extract-sass-vars-plugin.loader: themes字段未设置，将不会替换sass变量！'))
    callback(null, content);
  }
  
  const file = themes[0];
  const themeJsonPath = path.resolve(__dirname, file.path);
  if (fs.existsSync(themeJsonPath)) {
    const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
    // 正则匹配变量值
    const regex = /([\w-]+)\s*:\s*\$([a-zA-Z0-9_-]+)\s*;/g;
    let match;
    while ((match = regex.exec(content))) {
      if (themeJson[match[2]]) {
        content = content.replace(match[0], `${match[1]}: var(--${prefix}-${match[2]});`);
      }
    }
    callback(null, content);
  } else {
    emitWarning(new Error(`extract-sass-vars-plugin.loader: ${file.path} 文件不存在，将不会替换sass变量！`))
    callback(null, content);
  }

}

module.exports = loader