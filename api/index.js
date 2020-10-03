require('dotenv').config();
const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { merge } = require('lodash');
const config = require('../config');
const auth = require('./auth');
const channel = require('./channel');
const post = require('./post');
const requireAuth = require('./middlewares/auth.middleware');
const batchChannels = require('./dataLoader');
const dataLoader = require('./dataLoader');

mongoose.connect(config.mongo.host, { useNewUrlParser: true });
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};
const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: [auth.typeDefs, post.typeDefs, channel.typeDefs].join(' '),
  resolvers: merge({}, auth.resolvers, post.resolvers, channel.resolvers),
  middlewares: [requireAuth],
  context: async (req) => ({
    ...req,
    pubsub,
    models: {
      user: auth.model,
      channel: channel.model,
      post: post.model,
    },
    loader: dataLoader
  }),
});

module.exports = server;
