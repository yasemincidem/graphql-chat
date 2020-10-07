const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const server = require('./api/index');
const config = require('./config');
const webpackConfig = require('./webpack.config');
const { findLastKey } = require('lodash');

const APP_PORT = 8000;
const compiler = webpack(webpackConfig);
const app = new WebpackDevServer(compiler, {
  host: 'localhost',
  port: APP_PORT,
  proxy: {
    '/gql': 'http://localhost:4000',
  },
  open: true,
});
const corsOptions = {
  origin: true,
  credentials: true,
};
const serverOptions = {
  port: 4000,
  cors: corsOptions,
  endpoint: '/gql',
};
server.start(serverOptions, ({ port }) =>
  console.log(`Server is running on http://localhost: ${port}`),
);
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
