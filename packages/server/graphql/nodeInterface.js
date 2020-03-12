const { transformUser } = require('./merge');
const User = require('../models/user');
// const Comment = require('../models/comment');
const Wager = require('../models/wager');
// const Bet = require('../models/bet');
const { nodeDefinitions, fromGlobalId } = require('graphql-relay');

const registeredTypes = {};

function registerType(type) {
  registeredTypes[type.name] = type;
  return type;
}

const { nodeField, nodeInterface } = nodeDefinitions(
  async globalId => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      var user = await User.findById(id);
      user = transformUser(user);
      return user;
    }
    if (type === 'Wager') {
      var wager = await Wager.findById(id);
      wager = transformWager(wager);
      return wager;
    }
    if (type === 'Bet') {
      var bet = await Bet.findById(id);
      bet = transformBet(bet);
      return bet;
    }
    if (type === 'Comment') {
      var comment = await Comment.findById(id);
      comment = transformBet(comment);
      return comment;
    }
  },
  object => registeredTypes[object.constructor.name] || null
);

module.exports = {
  registerType,
  nodeField,
  nodeInterface
};
