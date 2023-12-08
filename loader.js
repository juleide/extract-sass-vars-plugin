const path = require('path');

function loader(content) {
  const options = this.getOptions();
  const prefix = options.prefix || 'hz';
  const files = options.files || [];

  const { resourcePath, emitFile, rootContext } = this;
  // 如果传入files, 则只处理传入的文件
  const paths = files.map(file => path.resolve(rootContext, file));
  if (paths.length && !paths.includes(resourcePath)) {
    return content;
  }

  // 正则匹配变量
  const variables = {};
  const regex = /\$([a-zA-Z0-9_-]+):\s*([^;]+(?:,\s*[^;]+)*)\s*;/g;
  let matches = [];
  let match;
  while ((match = regex.exec(content))) {
    matches.push(match);
  }
  matches.forEach(item => {
    content = content.replace(item[0], `$${item[1]}: var(--${prefix}-${item[1]});`);
    variables[`--${prefix}-${item[1]}`] = item[2];
  })

  // 生成json文件
  const dirname = path.dirname(resourcePath).split('/').join('_')
  const filename = path.basename(resourcePath, '.scss');

  emitFile(`themes/_build/${dirname}_${filename}.json`, JSON.stringify(variables));

  return content
}

module.exports = loader