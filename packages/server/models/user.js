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
  //     required: true,
  //     unique: true,
  //     lowercase: true
  //   }
  // ],
  // nonce: {
  //   type: String,
  //   required: true
  // },
  // mnemonic: {
  //   {
  //     type: String,
  //     required: true,
  //     unique: true,
  //     lowercase: true
  //   }
  // },
  // createdPolls: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Poll'
  //   }
  // ],
  // bets: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Bet'
  //   }
  // ]
});

module.exports = mongoose.model('User', userSchema);
