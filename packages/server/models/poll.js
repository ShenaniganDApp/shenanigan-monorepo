const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    live: {
      type: Boolean,
      default: false,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    options: [
      {
        type: String
      }
    ],
    bets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bet'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);
