const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const {
  globalIdField,
  connectionArgs,
  connectionFromArray
} = require('graphql-relay');
const User = require('../../models/user');
const Bet = require('../../models/bet');
const { connectionDefinitions } = require('../CustomConnectionType');
const { registerType, nodeInterface } = require('../nodeInterface');
const { transformUser, transformBet } = require('../merge');

const WagerType = registerType(
  new GraphQLObjectType({
    name: 'Wager',
    content: 'Wager data',
    fields: () => ({
      id: globalIdField('Wager'),
      _id: {
        type: GraphQLID,
        resolve: wager => wager._id
      },
      title: {
        type: GraphQLString,
        resolve: wager => wager.title
      },
      content: {
        type: GraphQLString,
        resolve: wager => wager.content
      },
      live: {
        type: GraphQLBoolean,
        resolve: wager => wager.live
      },
      creator: {
        type: require('../user/userType').UserType,
        resolve: async wager => {
          const user = await User.findOne({ _id: wager.creator });
          console.log(user);
          return transformUser(user);
        }
      },
      options: {
        type: GraphQLList(GraphQLString),
        resolve: wager => wager.options
      },
      // bets: {
      //   type: require('../bet/betType').BetConnection.connectionType,
      //   args: { ...connectionArgs },
      //   resolve: async (wager, args) => {
      //     const bets = await Bet.find({ wager: wager._id });
      //     bets.map(bet => {
      //       return transformBet(bet);
      //     });
      //     result = connectionFromArray(bets, args);
      //     result.totalCount = bets.length;
      //     result.count = result.edges.length;
      //     return result;
      //   }
      // },
      createdAt: {
        type: GraphQLNonNull(GraphQLString),
        resolve: wager => wager.createdAt
      },
      updatedAt: {
        type: GraphQLNonNull(GraphQLString),
        resolve: wager => wager.updatedAt
      }
    }),
    interfaces: () => [nodeInterface]
  })
);

const WagerConnection = connectionDefinitions({
  name: 'Wager',
  nodeType: GraphQLNonNull(WagerType)
});

module.exports = {
  WagerType,
  WagerConnection
};
