const DataLoader = require('dataloader');
const { keyBy } = require('lodash');
const Channels = require('./channel/channel.model');
const Users = require('./auth/user.model');
const Posts = require('./post/post.model');

const batchChannelUsers = async (userIds) => {
  const promises = userIds.map(async (key) => {
    return await Users.find({ _id: { $in: key.map((i) => i._id) } });
  });
  return Promise.all(promises);
};
const batchChannelPosts = async (channelIds) => {
  const promises = channelIds.map(async (key) => {
    return await Posts.find({ to: { $in: key } });
  });
  return Promise.all(promises);
};
module.exports = {
  loaderChannelUsers: () => new DataLoader(batchChannelUsers),
  loaderChannelPosts: () => new DataLoader(batchChannelPosts),
};
