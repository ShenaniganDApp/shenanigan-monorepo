import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import {
  connectionArgs,
  ConnectionArguments,
  fromGlobalId
} from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import * as UserLoader from "../UserLoader";
import UserModel from "../UserModel";
import UserType, { UserConnection } from "../UserType";

type UserById = {
  id: string;
};

type UserByEth = {
  address: string;
};

export const UserQueries = {
  me: {
    type: UserType,
    resolve: (_1: unknown, _2: unknown, context: GraphQLContext): unknown => {
      return context.user ? UserLoader.load(context, context.user._id) : null;
    }
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (
      _1: unknown,
      args: UserById,
      context: GraphQLContext
    ): unknown => {
      const { id } = fromGlobalId(args.id);
      console.log('id: ', id);
      return UserLoader.load(context, id);
    }
  },
  users: {
    type: UserConnection.connectionType,
    args: {
      ...connectionArgs
    },
    resolve: (
      _1: unknown,
      args: ConnectionArguments,
      context: GraphQLContext
    ): unknown => UserLoader.loadAll(context, args)
  },
  userByEth: {
    type: UserType,
    args: {
      address: {
        type: GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (
      _1: unknown,
      args: UserByEth,
      context: GraphQLContext
    ): Promise<unknown> => {
      const user = await UserModel.findOne({
        addresses: args.address
      });

      return user ? UserLoader.load(context, user.id) : null;
    }
  }
};
