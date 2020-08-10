import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { UserLoader, ChallengeLoader } from '../../loaders';
import UserType from '../user/UserType';
import ChallengeType from '../challenge/ChallengeType';
import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const CommentType = registerType(
  new GraphQLObjectType({
    name: 'Comment',
    description: 'Comment data',
    fields: () => ({
      id: globalIdField('Comment'),
      _id: {
        type: GraphQLID,
        resolve: (comment) => comment._id,
      },
      challenge: {
        type: ChallengeType,
        resolve: (comment, args, context) =>
          ChallengeLoader.load(context, comment.challenge),
      },
      content: {
        type: GraphQLString,
        resolve: (comment) => comment.content,
      },
      creator: {
        type: UserType,
        resolve: (comment, args, context) =>
          UserLoader.load(context, comment.creator),
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export default CommentType;
export const CommentConnection = connectionDefinitions({
  name: 'Comment',
  nodeType: CommentType,
});
