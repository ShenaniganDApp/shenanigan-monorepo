import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';

import WagerType, { WagerConnection } from '../WagerType';

import * as WagerLoader from '../WagerLoader';

export default {
  wager: {
    type: WagerType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return WagerLoader.load(context, id);
    }
  },
  wagers: {
    type: WagerConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString
      }
    },
    resolve: (obj, args, context) => {   
      return WagerLoader.loadWagers(context, args)}
  }
};
