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
const batchChannelPosts = async (keys) => {
  const id = keys.length ? keys[0].id : '';
  const args = keys.length ? keys[0].args : {};
  const last = args ? args.last : undefined;
  const before = args ? args.before : undefined;
  let results = [];
  if (before !== undefined) {
    const buff = new Buffer(before, 'base64');
    const cursorId = buff.toString('ascii');
    results = await Posts.find({ _id: { $gt: cursorId }, to: id }).limit(last);
    results.sort((a, b) => b.created_at - a.created_at);
  } else {
    results = await Posts.find({ to: id }).sort({ created_at: -1 }).limit(last);
  }
  const edges = results.map((post) => {
    const buffer = new Buffer(post.id);
    const cursor = buffer.toString('base64');
    return {
      node: post,
      cursor,
    };
  });
  const hasPreviousPage = results.length < last ? false : true;
  const pageInfo = {
    matchCount: results.length,
    hasPreviousPage,
  };
  const postConnetion = {
    edges,
    pageInfo,
  };
  return Promise.all(keys.map(() => postConnetion));
};
module.exports = {
  loaderChannelUsers: () => new DataLoader(batchChannelUsers),
  loaderChannelPosts: () => new DataLoader(batchChannelPosts),
};