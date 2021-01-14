const DataLoader = require('dataloader');
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
    results = await Posts.find({ _id: { $lt: cursorId }, to: id })
      .limit(last)
      .sort({ created_at: -1 });
  } else {
    results = await Posts.find({ to: id }).limit(last).sort({ created_at: -1 });
  }
  const edges = results.map(async (post) => {
    const buffer = new Buffer(post.id);
    const cursor = buffer.toString('base64');
    const from = await Users.findOne({ _id: post.from });
    const to = await Users.findOne({ _id: post.to });
    const newPost = { _id: post._id, text: post.text, created_at: post.created_at, from, to };
    return {
      node: newPost,
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
