const channel = require('.');
const authResolvers = require('../auth/auth.resolvers');

const createChannel = async (_, { input }, ctx) => {
  const { name, description } = input;
  const channel = await ctx.models.channel.create({ name, description });
  return channel;
};
const addPeopleToChannel = async (_, { input }, ctx) => {
  const { email, channelId } = input;
  const currentUser = await ctx.models.user.findOne({ email });
  if (!currentUser) {
    throw new Error('There is no user related to the email');
  }
  const currentChannel = await ctx.models.channel.findOne({ _id: channelId });
  if (!currentChannel) {
    throw new Error('There are no matching channels');
  }
  if (currentChannel.users.find((u) => u === currentUser._id)) {
    throw new Error('This user already added to the channel');
  }
  const users = currentChannel ? [...currentChannel.users, currentUser] : [currentUser];
  const channel = await ctx.models.channel.findByIdAndUpdate(
    { _id: channelId },
    { users },
    { new: true },
  );
  return channel;
};
const allChannels = async (_, { input }, ctx) => {
  const channels = await ctx.models.channel.find({});
  return channels;
};
const getChannel = async (_, { name }, ctx) => {
  const channel = await ctx.models.channel.findOne({ name });
  return channel;
};
module.exports = {
  Mutation: {
    createChannel,
    addPeopleToChannel,
  },
  Query: {
    allChannels,
    getChannel,
  },
};
