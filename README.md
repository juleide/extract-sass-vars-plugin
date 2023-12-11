# extract-sass-vars-plugin

这个插件适用于已有项目使用sass，希望增加多主题功能，该插件可将已有sass变量转换成css变量挂载到html节点下，通过配置多个json主题文件，可以实现多主题功能。

## 安装

```bash
npm install extract-sass-vars-plugin --save-dev
```

## 使用

在webpack.config.js中，添加如下配置：

```js
const ExtractSassVarsPlugin = require('extract-sass-vars-plugin');
// 主题json文件，可配置多个，内容为sass变量
const themes = [
  { name: 'light', path: path.resolve(__dirname, './src/themes/light.json') },
  { name: 'dark', path: path.resolve(__dirname, './src/themes/dark.json') }
]
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader',
          // sass-loader处理前先用该插件自带的loader将sass变量替换成css变量
          {
            loader: ExtractSassVarsPlugin.loader,
            options: {
              themes
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html'
    })
    new ExtractSassVarsPlugin({
      themes,
      defaultTheme: 'light' // 默认主题, 如果没有设置默认主题，则themes[0].name作为默认主题
    })
  ]
}
```

启动项目后, 插件将把所有的json主题文件中的sass变量转换成css变量，并挂载到html节点下，并在html节点上增加主题属性，如：

```html
<html data-theme="light">
  <head>
    <!--... -->
  </head>
  <body>
    <!--... -->
  </body>
</html>
```
通过切换data-theme属性，可以实现多主题功能。

## 注意事项

- 该插件只支持sass变量，不支持sass函数。
- 该插件只支持sass变量，不支持sass混合器。
- 该插件只支持sass变量，不支持sass导入。
- 该插件只支持sass变量，不支持sass运算。