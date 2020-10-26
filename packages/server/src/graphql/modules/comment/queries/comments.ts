import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { connectionArgs, fromGlobalId } from "graphql-relay";

import * as CommentLoader from "../CommentLoader";
import CommentType, { CommentConnection } from "../CommentType";

export default {
  comment: {
    type: CommentType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return CommentLoader.load(context, id);
    },
  },
  comments: {
    type: CommentConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: (obj, args, context) => {
      return CommentLoader.loadAll(context, args);
    },
  },
};
