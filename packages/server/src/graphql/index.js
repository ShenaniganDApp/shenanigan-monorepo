// const authResolver = require('./user/auth');
// const betsResolver = require('./prediction/bets');
const challengesResolver = require('./modules/challenge/queries/challenges');

const rootResolver = {
  // ...authResolver,
  ...challengesResolver,
  // ...betsResolver
};

module.exports = rootResolver;
