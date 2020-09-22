const createChannel = async (_, {input}, ctx) => {
    const { name, description } = input;
    const channel = await ctx.models.channel.create({ name, description });
    return channel;
}
const allChannels = async (_, {input}, ctx) => {
    const channels = await ctx.models.channel.find({});
    return channels;
};
const getChannel = async (_, {name}, ctx) => {
    const channel = await ctx.models.channel.findOne({ name });
    return channel;
};
module.exports = {
    Mutation: {
        createChannel,
    },
    Query: {
        allChannels,
        getChannel,
    }
}