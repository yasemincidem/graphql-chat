const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
});
module.exports = new mongoose.model('Post', PostSchema);
