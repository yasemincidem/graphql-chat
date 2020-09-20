const { GraphQLServer, PubSub } = require('graphql-yoga');
const cors = require('cors');
const helmet = require('helmet');
const createLoaders = require('./dataLoader');

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};
const corsOptions = {
  origin: process.env.NODE_ENV === "development" ? process.env.CLIENT_URL_DEV : process.env.CLIENT_URL_PROD,
  credentials: true
}
const options = {
  port: 4000,
  endpoint: '/gql',
  cors: corsOptions
};
const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: async req => ({
    ...req,
    pubsub,
    loaders: createLoaders(),
  })
});
server.start(options, ({ port }) => console.log(`Server is running on localhost: ${process.env.NODE_ENV}`));