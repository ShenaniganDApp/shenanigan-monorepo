import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, WagerLoader } from '../../loaders';

import WagerType from '../wager/WagerType';
import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const BetType = registerType(
  new GraphQLObjectType({
    name: 'Bet',
    description: 'Bet data',
    fields: () => ({
      id: globalIdField('Bet'),
      _id: {
        type: GraphQLID,
        resolve: (bet) => bet._id,
      },
      amount: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (bet) => bet.amount,
      },
      option: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (bet) => bet.option,
      },
      content: {
        type: GraphQLString,
        resolve: (bet) => bet.content,
      },
      wager: {
        type: WagerType,
        resolve: (wager, args, context) => {
          return WagerLoader.loadWager(wager, context, args);
        },
      },
      creator: {
        type: UserType,
        resolve: (wager, args, context) => {
          return UserLoader.loadCreator(wager, context, args);
        },
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export const BetConnection = connectionDefinitions({
  name: 'Bet',
  nodeType: BetType,
});

export default BetType;
