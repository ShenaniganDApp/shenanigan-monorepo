// const authResolver = require('./user/auth');
// const betsResolver = require('./bet/bets');
const wagersResolver = require('./modules/wager/queries/wagers');

const rootResolver = {
  // ...authResolver,
  ...wagersResolver,
  // ...betsResolver
};

module.exports = rootResolver;
