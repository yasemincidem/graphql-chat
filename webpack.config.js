const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/index.jsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    port: 3000,
    hotOnly: true,
    open: true,
    proxy: {
      '/gql': 'http://localhost:4000',
    },
  },
  module: {
    rules: [
      {
        test: /.js|.jsx$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: './public/index.html',
    hash: true,
  })],
};
module.exports = config;
