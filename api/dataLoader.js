const DataLoader = require('dataloader');
const { keyBy } = require('lodash');
const Channels = require('./channel/channel.model');
const Users = require('./auth/user.model');

const batchChannelUsers = async (userIds) => {
  const promises = userIds.map(async (key) => {
    return await Users.find({ _id: { $in: key.map((i) => i._id) } });
  });
  return Promise.all(promises);
};
module.exports = {
  loaderChannelUsers: () => new DataLoader(batchChannelUsers),
};
