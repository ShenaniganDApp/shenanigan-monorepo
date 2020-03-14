const DataLoader = require('dataloader');
// const Wager = require('../models/wager');
const User = require('./modules/user/UserModel');
// const Comment = require('../models/comment');
const { dateToString } = require('../helpers/date');

//////////////////////////////////////////////////////////
///      Reference Data Functions                      ///
///                                                    ///
///@dev: These functions take in model ID(s)           ///
///         and return data corresponding to ref       ///
///         defined in Mongoose model file             ///
//////////////////////////////////////////////////////////

// const wagerLoader = new DataLoader(wagerIds => {
//   return wagers(wagerIds);
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

const wagers = async wagerIds => {
  try {
    const wagers = await Wager.find({ _id: { $in: wagerIds } });
    return wagers.map(wager => {
      return transformWager(wager);
    });
  } catch (err) {
    throw err;
  }
};

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

const singleWager = async wagerId => {
  try {
    const wager = await wagerLoader.load(wagerId.toString());
    return wager;
  } catch (err) {
    throw err;
  }
};

// const transformBet = bet => {
//   return {
//     ...bet._doc,
//     _id: bet.id,
//     creator: user.bind(this, bet._doc.creator),
//     amount: +bet._doc.amount,
//     wager: singleWager.bind(this, bet._doc.wager),
//     createdAt: dateToString(bet._doc.createdAt),
//     updatedAt: dateToString(bet._doc.updatedAt)
//   };
// };

const transformWager = wager => {
  return {
    ...wager._doc,
    _id: wager.id,
    // bets: () => betLoader.loadMany(wager._doc.bets),
    creator: user.bind(this, wager._doc.creator),
    createdAt: dateToString(wager._doc.createdAt),
    updatedAt: dateToString(wager._doc.updatedAt)
  };
};

const transformUser = user => {
  console.log(user._doc)
  return {
    ...user._doc,
    _id: user.id,
    createdWagers: () => wagerLoader.loadMany(user._doc.createdWagers),
    // createdBets: () => betLoader.loadMany(user._doc.createdBets)
  };
};

// const transformComment = comment => {
//   return {
//     ...comment._doc,
//     _id: comment.id,
//     user: user.bind(this, comment._doc.user),
//     content: comment._doc.content,
//     wager: singleWager.bind(this, comment._doc.wager),
//     createdAt: dateToString(comment._doc.createdAt),
//     updatedAt: dateToString(comment._doc.updatedAt)
//   };
// };

exports.transformUser = transformUser;
exports.transformWager = transformWager;