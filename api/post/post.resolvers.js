const sendMessage = async (_, { input }, ctx) => {
  const { to, from, text } = input;
  let newMessage;
  if (!ctx.models.post) {
    result = await ctx.models.post.create({
      text,
      from,
      created_at: new Date().getTime(),
      to,
    });
  }
  newMessage = await ctx.models.post.insertMany({
    to,
    text,
    from,
    created_at: new Date().getTime(),
  });
  ctx.pubsub.publish('SEND_MESSAGE_TRIGGER', { newMessage: newMessage[0] });
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
