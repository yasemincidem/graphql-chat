const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  users: {
    type: [Object],
    ref: 'User',
    required: false,
  },
});
module.exports = mongoose.model('Channel', ChannelSchema);
