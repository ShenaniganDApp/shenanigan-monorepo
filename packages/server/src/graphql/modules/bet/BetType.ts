import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, WagerLoader, CommentLoader } from '../../loaders';

import WagerType from '../wager/WagerType';
import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';
import CommentType from '../comment/CommentType';

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
      wager: {
        type: WagerType,
        resolve: (bet, args, context) => {
          return WagerLoader.load(context, bet.wager);
        },
      },
      creator: {
        type: UserType,
        resolve: (bet, args, context) => {
          return UserLoader.load(context, bet.creator);
        },
      },
      comment: {
        type: CommentType,
        resolve: (bet, args, context) => {
          return CommentLoader.load(context, bet.comment);
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
