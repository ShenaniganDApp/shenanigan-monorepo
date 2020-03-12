const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true
  },
  // addresses: [
  //   {
  //     type: String,
  //     required: false,
  //     unique: true,
  //     lowercase: true
  //   }
  // ],
  createdWagers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Wager'
    }
  ],
  // bets: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Bet'
  //   }
  // ]
});

module.exports = mongoose.model('User', userSchema);
