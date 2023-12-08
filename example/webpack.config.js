const path = require('path');
const ExtractSassVarsPlugin = require('../index');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader',
          {
            loader: ExtractSassVarsPlugin.loader,
            options: {
              prefix: 'hz',
              files: [
                path.resolve(__dirname, './style/dark.scss')
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractSassVarsPlugin({
      themeJsonDir: path.resolve(__dirname, './themes')
    })
  ]
};
