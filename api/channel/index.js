const channelModel = require('./channel.model');
const channelResolvers = require('./channel.resolvers');
const { loadGQLFile } = require('../utils');

module.exports = {
  model: channelModel,
  resolvers: channelResolvers,
  typeDefs: loadGQLFile('channel/channel.graphql'),
};
