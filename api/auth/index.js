const userModel = require('./user.model');
const authResolvers = require('./auth.resolvers');
const { loadGQLFile } = require('../utils');

module.exports = {
  model: userModel,
  resolvers: authResolvers,
  typeDefs: loadGQLFile('auth/auth.graphql'),
};
