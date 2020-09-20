const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const babelConfig = require('./api/babelrc.json');

const outputDirectory = 'dist';
const DEV = process.env.NODE_ENV !== 'production';

const config = new Promise(async (resolve, reject) => {
  const appConfig = {
    entry: ['./src/index.jsx'],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js',
    },
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
    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true,
      proxy: {
        '/gql': 'http://localhost:4000',
      },
    },
    plugins: [
      new WebpackBar({ name: '​client' }),
      new DotenvPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ]
  };
  const gqlConfig = {
    target: 'node',
    mode: DEV ? 'development' : 'production',
    name: 'gql',
    entry: './api/index.js',
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'server.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    ignore: ["./api/node_modules/"],
    exclude: "\\./api/node_modules\\"
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new DotenvPlugin(),
      new WebpackBar({ name: '​gql-server' })
    ],
  };
  resolve([appConfig, gqlConfig].filter(Boolean))
});
module.exports = config;
