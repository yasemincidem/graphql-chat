require('dotenv').config();
const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { merge } = require('lodash');
const config = require('./config');
const auth = require('./auth');

mongoose.connect(config.mongo.host, {useNewUrlParser: true});
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};
const corsOptions = {
  origin: config.env,
  credentials: true
}
const options = {
  port: 4000,
  cors: corsOptions
};
const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: [auth.typeDefs].join(" "),
  resolvers: merge({}, auth.resolvers),
  context: async req => ({
    ...req,
    pubsub,
    models: {
      user: auth.model
    }
  })
});
server.start(options, ({ port }) => console.log(`Server is running on localhost: ${config.env}`));