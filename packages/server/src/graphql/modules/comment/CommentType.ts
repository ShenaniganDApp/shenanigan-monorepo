import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { UserLoader, WagerLoader } from '../../loaders';
import UserType from '../user/UserType';
import WagerType from '../wager/WagerType';
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
      wager: {
        type: WagerType,
        resolve: (comment, args, context) =>
          WagerLoader.load(context, comment.wager),
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
