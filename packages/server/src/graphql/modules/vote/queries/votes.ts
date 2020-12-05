import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import {
  connectionArgs,
  ConnectionArguments,
  fromGlobalId,
} from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import * as VoteLoader from "../VoteLoader";
import { VoteConnection, VoteType } from "../VoteType";

type VoteById = {
  id: string;
};

export const VoteQueries = {
  vote: {
    type: VoteType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (
      _1: unknown,
      args: VoteById,
      context: GraphQLContext
    ): unknown => {
      const { id } = fromGlobalId(args.id);
      return VoteLoader.load(context, id);
    },
  },
  votes: {
    type: VoteConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: (
      _1: unknown,
      args: ConnectionArguments,
      context: GraphQLContext
    ): unknown => {
      return VoteLoader.loadAll(context, args);
    },
  },
};
