// const authResolver = require('./user/auth');
// const betsResolver = require('./bet/bets');
const wagersResolver = require('./wager/wagers');

const rootResolver = {
  // ...authResolver,
  ...wagersResolver,
  // ...betsResolver
};

module.exports = rootResolver;
