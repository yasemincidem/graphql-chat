const sendMessage = async (_, { input }, ctx) => {
  const { to, from, text } = input;
  let newMessage;
  if (!ctx.models.post) {
    result = await ctx.models.post.create({
      text,
      from,
      created_at: new Date().getTime(),
      to: to || null,
    });
  }
  newMessage = await ctx.models.post.insertMany({
    to: to || null,
    text,
    from,
    created_at: new Date().getTime(),
  });
  const channelPost = await ctx.loader.loaderChannelPosts().load({ id: to });
  const channels = await ctx.loader.loaderChannels().load({ id: to });
  const channel = channels && channels.length ? channels[0] : {};
  const newPost = await channelPost.edges[0];
  ctx.pubsub.publish('SEND_MESSAGE_TRIGGER', { newMessage: {...newPost, channel}  });
  return newMessage;
};
module.exports = {
  Mutation: {
    sendMessage,
  },
  Subscription: {
    newMessage: {
      subscribe(_, args, { pubsub }) {
        return pubsub.asyncIterator('SEND_MESSAGE_TRIGGER');
      },
    },
  },
};
