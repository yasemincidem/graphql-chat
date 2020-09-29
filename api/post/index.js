const postModel = require('./post.model');
const postResolvers = require('./post.resolvers');
const { loadGQLFile } = require('../utils');

module.exports = {
  model: postModel,
  resolvers: postResolvers,
  typeDefs: loadGQLFile('post/post.graphql'),
};
