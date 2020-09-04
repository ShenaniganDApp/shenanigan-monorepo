import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';

import CommentType, { CommentConnection } from '../CommentType';

import * as CommentLoader from '../CommentLoader';

export default {
  comment: {
    type: CommentType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return CommentLoader.load(context, id);
    }
  },
  comments: {
    type: CommentConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString
      }
    },
    resolve: (obj, args, context) => {   
      return CommentLoader.loadAll(context, args)}
  }
};
