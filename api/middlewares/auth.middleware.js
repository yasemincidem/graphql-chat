const jwt = require('jsonwebtoken');
const config = require('../../config');
const { resolveConfigFile } = require('prettier');

const requireAuth = async (resolve, root, args, ctx, info) => {
  const Authorization = ctx.request.get('Authorization');
  if (!Authorization) {
    throw new Error('Authorization is missing');
  }
  const token = Authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, config.jwtSecret);
  const user = await ctx.models.user.findOne({ _id: userId });
  if (!user) {
    throw new Error('Unauthenticated !');
  }
  return resolve();
};
module.exports = {
  Mutation: {
    createChannel: requireAuth,
    addPeopleToChannel: requireAuth,
  },
  Query: {
    channels: requireAuth,
    channel: requireAuth
  },
};
