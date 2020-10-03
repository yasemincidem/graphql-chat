const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const server = require('./api/index');
const config = require('./config');
const webpackConfig = require('./webpack.config');

const APP_PORT = 3000;
const compiler = webpack(webpackConfig);
const app = new WebpackDevServer(compiler);
const corsOptions = {
  origin: config.env,
  credentials: true,
};
const serverOptions = {
  port: 4000,
  cors: corsOptions,
};
server.start(serverOptions, ({ port }) =>
  console.log(`Server is running on http://localhost: ${port}`),
);
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
