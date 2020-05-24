import CandidateType, { CandidateConnection } from '../CandidateType';
import * as CandidateLoader from '../CandidateLoader';

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';



export default {
  candidate: {
    type: CandidateType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return CandidateLoader.load(context, id);
    },
  },
  candidates: {
    type: CandidateConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: (obj, args, context) => {
      return CandidateLoader.loadCandidates(context, args);
    },
  },
};
