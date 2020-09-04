import DonationType, { DonationConnection } from '../DonationType';
import * as DonationLoader from '../DonationLoader';

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';



export default {
  donation: {
    type: DonationType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return DonationLoader.load(context, id);
    },
  },
  donations: {
    type: DonationConnection.connectionType,
    args: {
      ...connectionArgs
    },
    resolve: (obj, args, context) => {
      return DonationLoader.loadAll(context, args);
    },
  },
};
