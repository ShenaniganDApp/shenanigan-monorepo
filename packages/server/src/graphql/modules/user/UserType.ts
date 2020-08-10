import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField, connectionArgs } from 'graphql-relay';

import { ChallengeLoader, PredictionLoader, DonationLoader } from '../../loaders';
import { ChallengeConnection } from '../challenge/ChallengeType';
import { PredictionConnection } from '../prediction/PredictionType';
import { DonationConnection } from '../donation/DonationType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    description: 'User data',
    fields: () => ({
      id: globalIdField('User'),
      _id: {
        type: GraphQLID,
        resolve: (user) => user._id,
      },
      username: {
        type: GraphQLString,
        resolve: (user) => user.username,
      },
      email: {
        type: GraphQLString,
        resolve: (user) => user.email,
      },
      password: {
        type: GraphQLString,
        resolve: (user) => user.password,
      },
      predictions: {
        type: PredictionConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          PredictionLoader.loadUserPredictions(user, context, args),
      },
      donations: {
        type: DonationConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          DonationLoader.loadUserDonations(user, context, args),
      },
      createdChallenges: {
        type: ChallengeConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          ChallengeLoader.loadUserChallenges(user, context, args),
      },
    }),
    interfaces: () => [nodeInterface],
  })
);
export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

export default UserType;
