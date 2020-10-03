const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');

const outputDirectory = 'dist';
const DEV = process.env.NODE_ENV !== 'production';

const config = {
  mode: 'development',
  entry: ['./src/index.jsx'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new WebpackBar({ name: '​client' }),
    new DotenvPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    path: path.join(__dirname, 'dir'),
    filename: 'bundle.js',
  },
};
module.exports = config;
