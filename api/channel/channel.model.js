const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false
  },
  isDirectMessage: {
    type: Boolean,
    required: false
  },
  created_at: {
    type: String,
    required: true
  },
  users: {
    type: [Object],
    ref: 'User',
    required: true,
  },
  posts: {
    type: [Object],
    ref: 'Post',
    required: false,
  },
});
module.exports = mongoose.model('Channel', ChannelSchema);
