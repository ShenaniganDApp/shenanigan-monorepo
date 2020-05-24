import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField, connectionArgs } from 'graphql-relay';

import { UserLoader, WagerLoader, DonationLoader } from '../../loaders';

import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';
import { DonationConnection } from '../donation/DonationType';
import WagerType from '../wager/WagerType';

const CandidateType = registerType(
  new GraphQLObjectType({
    name: 'Candidate',
    description: 'Candidate data',
    fields: () => ({
      id: globalIdField('Candidate'),
      _id: {
        type: GraphQLID,
        resolve: (candidate) => candidate._id,
      },
      total: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (candidate) => candidate.total,
      },
      rank: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (candidate) => candidate.rank,
      },
      creator: {
        type: GraphQLNonNull(UserType),
        resolve: (candidate, args, context) => {
          return UserLoader.load(context, candidate.creator);
        },
      },
      wager: {
        type: GraphQLNonNull(WagerType),
        resolve: (candidate, args, context) => {
          return WagerLoader.load(context, candidate.wager);
        },
      },
      donations: {
        type: DonationConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (candidate, args, context) =>
          DonationLoader.loadCandidateDonations(candidate, context, args),
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export const CandidateConnection = connectionDefinitions({
  name: 'Candidate',
  nodeType: CandidateType,
});

export default CandidateType;
