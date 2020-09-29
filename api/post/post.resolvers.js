const sendMessage = async (_, { input }, ctx) => {
  const { to, from, text } = input;
  let result;
  if (!ctx.models.post) {
    result = await ctx.models.post.create({
        text,
        from,
        created_at: new Date().getTime(),
        to,
      });
  }
  result = await ctx.models.post.insertMany({ to, text, from, created_at: new Date().getTime() });
  return result;
};
module.exports = {
  Mutation: {
    sendMessage,
  },
};
