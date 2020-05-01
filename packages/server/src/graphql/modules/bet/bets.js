const Bet = require('../../models/bet');
const Option = require('../../models/option')
const { transformBet} = require('../merge');

module.exports = {
  bets: async (args, req) => {
    if(!req.isAuth) {
        throw new Error('Unauthenticated')
    }
    try {
      const bets = await Bet.find.find({ option: args.optionId });;
      return bets.map(bet => {
        return transformBet(bet);
      });
    } catch (err) {
      throw err;
    }
  },
  betOption: async (args, req) => {
    if(!req.isAuth) {
        throw new Error('Unauthenticated')
    }
    const fetchedOption= await Option.findOne({ _id: args.optionId });
    const bet = new Bet({
      user: req.userId,
      amount: args.amount,
      option: fetchedOption
    });
    try {
      const result = await bet.save();
      return transformBet(result);
    } catch (err) {
      throw err;
    }
  }
};
