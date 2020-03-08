const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const optionSchema = new Schema(
  {
    poll: {
      type: Schema.Types.ObjectId,
      ref: 'Poll'
    },
    description: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('Option', optionSchema);
