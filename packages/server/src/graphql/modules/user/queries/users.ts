import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { connectionArgs, fromGlobalId } from "graphql-relay";

import * as UserLoader from "../UserLoader";
import User from "../UserModel";
import UserType, { UserConnection } from "../UserType";

export default {
  me: {
    type: UserType,
    resolve: (root, args, context) => {
      return context.user ? UserLoader.load(context, context.user._id) : null;
    },
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, context) => {
      const { id } = fromGlobalId(args.id);
      return UserLoader.load(context, id);
    },
  },
  users: {
    type: UserConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: (_, args, context) => UserLoader.loadAll(context, args),
  },
};
