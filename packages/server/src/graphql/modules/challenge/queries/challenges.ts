import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';

import ChallengeType, { ChallengeConnection } from '../ChallengeType';

import * as ChallengeLoader from '../ChallengeLoader';

export default {
  challenge: {
    type: ChallengeType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return ChallengeLoader.load(context, id);
    }
  },
  challenges: {
    type: ChallengeConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString
      }
    },
    resolve: (obj, args, context) => {   
      return ChallengeLoader.loadChallenges(context, args)}
  }
};
