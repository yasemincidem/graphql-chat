require('dotenv').config();
const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { merge } = require('lodash');
const config = require('./config');
const auth = require('./auth');
const channel = require('./channel');
const requireAuth = require('./middlewares/auth.middleware');
const batchChannels = require('./dataLoader');
const dataLoader = require('./dataLoader');

mongoose.connect(config.mongo.host, { useNewUrlParser: true });
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};
const corsOptions = {
  origin: config.env,
  credentials: true,
};
const options = {
  port: 4000,
  cors: corsOptions,
};
const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: [auth.typeDefs, channel.typeDefs].join(' '),
  resolvers: merge({}, auth.resolvers, channel.resolvers),
  middlewares: [requireAuth],
  context: async (req) => ({
    ...req,
    pubsub,
    models: {
      user: auth.model,
      channel: channel.model,
    },
    loader: dataLoader
  }),
});
server.start(options, ({ port }) => console.log(`Server is running on localhost: ${config.env}`));
