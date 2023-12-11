const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractSassVarsPlugin = require('extract-sass-vars-plugin');

const themes = [
  { name: 'light', path: path.resolve(__dirname, './themes/light.json') },
  { name: 'dark', path: path.resolve(__dirname, './themes/dark.json') }
]

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader',
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
    new HtmlWebpackPlugin(),
    new ExtractSassVarsPlugin({
      themes
    })
  ]
};
