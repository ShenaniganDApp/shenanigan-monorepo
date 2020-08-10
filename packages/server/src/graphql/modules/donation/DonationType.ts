import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, ChallengeLoader, CommentLoader } from '../../loaders';

import ChallengeType from '../challenge/ChallengeType';
import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';
import CommentType from '../comment/CommentType';
import donations from './queries/donations';

const DonationType = registerType(
  new GraphQLObjectType({
    name: 'Donation',
    description: 'Donation data',
    fields: () => ({
      id: globalIdField('Donation'),
      _id: {
        type: GraphQLNonNull(GraphQLID),
        resolve: (donation) => donation._id,
      },
      amount: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (donation) => donation.amount,
      },
      creator: {
        type: GraphQLNonNull(UserType),
        resolve: (donation, args, context) => {
          return UserLoader.load(context, donation.creator);
        },
      },
      comment: {
        type: CommentType,
        resolve: (donation, args, context) => {
          return CommentLoader.load(context, donation.comment);
        },
      },
      challenge: {
        type: ChallengeType,
        resolve: (donation, args, context) => {
          return ChallengeLoader.load(context, donation.challenge);
        },
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export const DonationConnection = connectionDefinitions({
  name: 'Donation',
  nodeType: DonationType,
});

export default DonationType;
