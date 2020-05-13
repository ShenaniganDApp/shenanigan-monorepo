import BetType, { BetConnection } from '../BetType';
import * as BetLoader from '../BetLoader';

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';



export default {
  bet: {
    type: BetType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return BetLoader.load(context, id);
    },
  },
  bets: {
    type: BetConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: (obj, args, context) => {
      return BetLoader.loadBets(context, args);
    },
  },
};
