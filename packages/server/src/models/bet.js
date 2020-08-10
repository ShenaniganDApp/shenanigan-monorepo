const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const betSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    option: {
      type: Number,
      required: true
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    },
    comment:{
      type:Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', betSchema);
