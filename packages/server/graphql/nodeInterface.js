const { transformUser } = require('./merge');
const User = require('../models/user');
// const Comment = require('../models/comment');
// const Poll = require('../models/poll');
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
    if (type === 'Poll') {
      var poll = await Poll.findById(id);
      poll = transformPoll(poll);
      return poll;
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
