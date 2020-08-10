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

const PredictionType = registerType(
  new GraphQLObjectType({
    name: 'Prediction',
    description: 'Prediction data',
    fields: () => ({
      id: globalIdField('Prediction'),
      _id: {
        type: GraphQLID,
        resolve: (prediction) => prediction._id,
      },
      amount: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (prediction) => prediction.amount,
      },
      option: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (prediction) => prediction.option,
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
    }),
    interfaces: () => [nodeInterface],
  })
);

export const PredictionConnection = connectionDefinitions({
  name: 'Prediction',
  nodeType: PredictionType,
});

export default PredictionType;
