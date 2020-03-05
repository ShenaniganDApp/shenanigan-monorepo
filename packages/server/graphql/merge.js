const DataLoader = require('dataloader');
// const Poll = require('../models/poll');
const User = require('../models/user');
// const Comment = require('../models/comment');
// const { dateToString } = require('../helpers/date');

//////////////////////////////////////////////////////////
///      Reference Data Functions                      ///
///                                                    ///
///@dev: These functions take in model ID(s)           ///
///         and return data corresponding to ref       ///
///         defined in Mongoose model file             ///
//////////////////////////////////////////////////////////

// const pollLoader = new DataLoader(pollIds => {
//   return polls(pollIds);
// });

// const betLoader = new DataLoader(betIds => {
//   return bets(betIds);
// });

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const user = async userId => {
  try {
    const user = userLoader.load(userId.toString());
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

// const polls = async pollIds => {
//   try {
//     const polls = await Poll.find({ _id: { $in: pollIds } });
//     return polls.map(poll => {
//       return transformPoll(poll);
//     });
//   } catch (err) {
//     throw err;
//   }
// };

// const bets = async betIds => {
//   try {
//     const bets = await Bet.find({ _id: { $in: betIds } });
//     return bets.map(bet => {
//       return transformBet(bet);
//     });
//   } catch (err) {
//     throw err;
//   }
// };

// const comments = async commentIds => {
//   try {
//     const comments = await Comment.find({ _id: { $in: commentIds } });
//     return comments.map(comment => {
//       return transformComment(comment);
//     });
//   } catch (err) {
//     throw err;
//   }
// };

// const singlePoll = async pollId => {
//   try {
//     const poll = await pollLoader.load(pollId.toString());
//     return poll;
//   } catch (err) {
//     throw err;
//   }
// };

// const transformBet = bet => {
//   return {
//     ...bet._doc,
//     _id: bet.id,
//     creator: user.bind(this, bet._doc.creator),
//     amount: +bet._doc.amount,
//     poll: singlePoll.bind(this, bet._doc.poll),
//     createdAt: dateToString(bet._doc.createdAt),
//     updatedAt: dateToString(bet._doc.updatedAt)
//   };
// };

// const transformPoll = poll => {
//   return {
//     ...poll._doc,
//     _id: poll.id,
//     bets: () => betLoader.loadMany(poll._doc.bets),
//     creator: user.bind(this, poll._doc.creator),
//     createdAt: dateToString(poll._doc.createdAt),
//     updatedAt: dateToString(poll._doc.updatedAt)
//   };
// };

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    createdPolls: () => pollLoader.loadMany(user._doc.createdPolls),
    createdBets: () => betLoader.loadMany(user._doc.createdBets)
  };
};

// const transformComment = comment => {
//   return {
//     ...comment._doc,
//     _id: comment.id,
//     user: user.bind(this, comment._doc.user),
//     content: comment._doc.content,
//     poll: singlePoll.bind(this, comment._doc.poll),
//     createdAt: dateToString(comment._doc.createdAt),
//     updatedAt: dateToString(comment._doc.updatedAt)
//   };
// };

exports.transformUser = transformUser;
// z