import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, ChallengeLoader, CommentLoader, PredictionLoader } from '../../loaders';

import ChallengeType from '../challenge/ChallengeType';
import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';
import CommentType from '../comment/CommentType';

const PredictionType = registerType(
  new GraphQLObjectType({
    name: 'Prediction',
    description: 'Prediction data',
    fields: () => ({
      id: globalIdField('Prediction'),
      _id: {
        type: GraphQLNonNull(GraphQLID),
        resolve: (prediction) => prediction._id,
      },
      cards: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (prediction) => prediction.cards,
      },
      option: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (prediction) => prediction.option,
      },
      opponent: {
        type: PredictionType,
        resolve: (prediction, args, context) => {
          return PredictionLoader.load(context, prediction.opponent);
        },
      },
      challenge: {
        type: ChallengeType,
        resolve: (prediction, args, context) => {
          return ChallengeLoader.load(context, prediction.challenge);
        },
      },
      creator: {
        type: UserType,
        resolve: (prediction, args, context) => {
          return UserLoader.load(context, prediction.creator);
        },
      },
      comment: {
        type: CommentType,
        resolve: (prediction, args, context) => {
          return CommentLoader.load(context, prediction.comment);
        },
      },
      blockTimestamp: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (prediction) => prediction.blockTimestamp,
      }
    }),
    interfaces: () => [nodeInterface],
  })
);

export const PredictionConnection = connectionDefinitions({
  name: 'Prediction',
  nodeType: PredictionType,
});

export default PredictionType;
