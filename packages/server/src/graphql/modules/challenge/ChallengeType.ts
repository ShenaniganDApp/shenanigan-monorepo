import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField, connectionArgs } from 'graphql-relay';
import { UserLoader, CommentLoader, PredictionLoader} from '../../loaders';
import UserType from '../user/UserType';
import {CommentConnection} from '../comment/CommentType';
import {PredictionConnection} from '../prediction/PredictionType';
import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const ChallengeType = registerType(
  new GraphQLObjectType({
    name: 'Challenge',
    description: 'Challenge data',
    fields: () => ({
      id: globalIdField('Challenge'),
      _id: {
        type: GraphQLNonNull(GraphQLID),
        resolve: (challenge) => challenge._id,
      },
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challenge) => challenge.title,
      },
      content: {
        type: GraphQLString,
        resolve: (challenge) => challenge.content,
      },
      live: {
        type: GraphQLBoolean,
        resolve: (challenge) => challenge.live,
      },
      creator: {
        type: GraphQLNonNull(UserType),
        resolve: (challenge, args, context) => {
          return UserLoader.load(context, challenge.creator);
        },
      },
      options: {
        type: GraphQLNonNull(GraphQLList(GraphQLString)),
        resolve: (challenge) => challenge.options,
      },
      predictions: {
        type: PredictionConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (challenge, args, context) =>
          PredictionLoader.loadChallengePredictions(challenge, context, args),
      },
      comments: {
        type: CommentConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (challenge, args, context) =>
          CommentLoader.loadChallengeComments(challenge, context, args),
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export default ChallengeType;

export const ChallengeConnection = connectionDefinitions({
  name: 'Challenge',
  nodeType: ChallengeType,
});
