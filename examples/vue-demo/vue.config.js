const path = require("path");
const ExtractSassVarsPlugin = require('extract-sass-vars-plugin');
const themes = [
  { name: 'light', path: path.resolve(__dirname, './src/themes/light.json') },
  { name: 'dark', path: path.resolve(__dirname, './src/themes/dark.json') }
]

module.exports = {
  lintOnSave: false,
  publicPath: '/',
  assetsDir: 'assets',
  // 让color模块进过babel-loader转译
  transpileDependencies: ["color"],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
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
      new ExtractSassVarsPlugin({
        themes
      })
    ]
  }
};
