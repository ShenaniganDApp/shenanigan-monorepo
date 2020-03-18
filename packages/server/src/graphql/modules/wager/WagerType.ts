import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { UserLoader } from '../../loaders';
import UserType from '../user/UserType';
// import Bet from '../../models/bet');
import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const WagerType = registerType(
  new GraphQLObjectType({
    name: 'Wager',
    description: 'Wager data',
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
        type: UserType,
        resolve: (wager, args, context) => {
          return UserLoader.loadCreator(wager, context, args);
        }
      },
      options: {
        type: GraphQLList(GraphQLString),
        resolve: wager => wager.options
      }
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
      // }
    }),
    interfaces: () => [nodeInterface]
  })
);

export default WagerType;

export const WagerConnection = connectionDefinitions({
  name: 'Wager',
  nodeType: WagerType
});
