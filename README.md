# extract-sass-vars-plugin

这个插件适用于已有项目样式使用sass变量，后续希望扩展多主题功能，该插件可将已有sass变量转换成css变量挂载到html节点下，通过配置多个json主题文件，可以实现多主题功能。

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
      defaultTheme: 'light' // 默认主题, 如果没有设置默认主题，则取themes[0].name作为默认主题
    })
  ]
}
```

启动项目后, 插件将把所有的json主题文件中的sass变量转换成css变量并生成themes.css文件，挂载到html节点下，同时在html节点上增加主题属性data-theme="light"：

```html
<html data-theme="light">
  <head>
    <!--... -->
    <link href="/themes.css" rel="stylesheet" id="theme-link-tag">
  </head>
  <body>
    <!--... -->
  </body>
</html>
```

themes.css文件内容如下，该文件将自动注入到index.html中

```css
html[data-theme="light"] {
  --color-primary: #333;
  --color-secondary: #666;
}
html[data-theme="dark"] {
  --color-primary: #fff;
  --color-secondary: #ccc;
}```

通过切换data-theme属性，可以实现多主题功能。
```js
document.documentElement.setAttribute('data-theme', 'dark');
```

## demo
查看项目examples目录下demo，可以看到如何使用该插件。


## Stargazers over time

[![Stargazers over time](https://starchart.cc/juleide/extract-sass-vars-plugin.svg)](https://starchart.cc/juleide/extract-sass-vars-plugin)