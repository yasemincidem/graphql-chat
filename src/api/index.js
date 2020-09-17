const { GraphQLServer } = require('graphql-yoga');

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
const options = {
  port: 4000,
  endpoint: '/gql',
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(options, ({ port }) => console.log(`Server is running on localhost: ${port}`));
