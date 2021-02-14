const ObjectId = require('mongodb').ObjectId;

const createChannel = async (_, { input }, ctx) => {
  const { name, description, email } = input;
  const user = await ctx.models.user.findOne({ email });
  if (!user) {
    throw new Error('There is no user related to the email');
  }
  const channel = await ctx.models.channel.create({
    name,
    description,
    created_at: new Date().getTime(),
    isDirectMessage: false,
    users: [user],
  });
  return channel;
};
const addPeopleToChannel = async (_, { input }, ctx) => {
  const { email } = input;
  const currentUser = await ctx.models.user.findOne({ email });
  if (!currentUser) {
    throw new Error('There is no user related to the email');
  }
  delete currentUser['password'];
  let currentChannel;
  if (!input.channelId) {
    const currentUser = await ctx.models.user.findOne({ email: input.owner });
    currentChannel = await ctx.models.channel.create({
      name: input.name,
      description: '',
      created_at: new Date().getTime(),
      isDirectMessage: true,
      users: [currentUser],
    });
  } else {
    currentChannel = await ctx.models.channel.findOne({ _id: input.channelId });
  }
  if (!currentChannel) {
    throw new Error('There are no matching channels');
  }
  if (currentChannel.users.find((u) => u === currentUser._id)) {
    throw new Error('This user already added to the channel');
  }
  const users = currentChannel ? [...currentChannel.users, currentUser] : [currentUser];
  const channel = await ctx.models.channel.findByIdAndUpdate(
    { _id: currentChannel._id },
    { users },
    { new: true },
  );
  ctx.pubsub.publish('NEW_USER_ADDED_TO_CHANNEL_TRIGGER', { newUserAddedToChannel: channel  });
  return channel;
};
const channels = async (_, { userId }, ctx) => {
  const channels = await ctx.models.channel.find({ 'users._id': ObjectId(userId) });
  return channels;
};
const channel = async (_, { id }, ctx) => {
  const channel = await ctx.models.channel.findOne({ _id: id });
  return channel;
};
module.exports = {
  Mutation: {
    createChannel,
    addPeopleToChannel,
  },
  Query: {
    channels,
    channel,
  },
  Channel: {
    users: async (channel, args, ctx) => await ctx.loader.loaderChannelUsers().load(channel.users),
    posts: async (channel, args, ctx) =>
      await ctx.loader.loaderChannelPosts().load({ id: channel._id, args }),
  },
  Subscription: {
    newUserAddedToChannel: {
      subscribe(_, args, { pubsub }) {
        return pubsub.asyncIterator('NEW_USER_ADDED_TO_CHANNEL_TRIGGER');
      },
    },
  },
};
