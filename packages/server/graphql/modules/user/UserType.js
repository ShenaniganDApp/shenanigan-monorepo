const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const {
  globalIdField,
  connectionArgs,
  connectionFromArray
} = require('graphql-relay');

const Wager = require('./UserModel');
// const Bet = require('../../models/bet');
const { transformWager } = require('../../merge');

const { connectionDefinitions } = require('../../CustomConnectionType');
const { registerType, nodeInterface } = require('../../nodeInterface');

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    description: 'User data',
    fields: () => ({
      id: globalIdField('User'),
      _id: {
        type: GraphQLID,
        resolve: user => user._id
      },
      username: {
        type: GraphQLString,
        resolve: user => user.username
      },
      email: {
        type: GraphQLString,
        resolve: user => user.email
      },
      password: {
        type: GraphQLString,
        resolve: user => user.password
      },
      //   bets:{
      //     type: require('../bet/betType').BetConnection.connectionType,
      //     args: { ...connectionArgs },
      //     resolve: async (user, args) => {
      //       const bets = await Bet.find({ creator: user._id });
      //       bets.map(bet => {
      //         return transformBet(bet);
      //       });
      //       result = connectionFromArray(bets, args);
      //       result.totalCount = bets.length;
      //       result.count = result.edges.length;
      //       return result;
      //     }
      //   },
        createdWagers: {
          type: require('../wager/wagerType').WagerConnection.connectionType,
          args: { ...connectionArgs },
          resolve: async (user, args) => {
            const wagers = await Wager.find({ creator: user._id });
            wagers.map(wager => {
              return transformWager(wager);
            });
            result = connectionFromArray(wagers, args);
            result.totalCount = wagers.length;
            result.count = result.edges.length;
            return result;
          }
        }
    }),
    interfaces: () => [nodeInterface]
  })
);
const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLNonNull(UserType)
});

module.exports = {
  UserType,
  UserConnection
};
