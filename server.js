const server = require('./api/index');

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
server.express.use('/index.html', (req, res) => {
  res.statusCode = '302'; // eslint-disable-line no-param-reassign
  res.end();
});

