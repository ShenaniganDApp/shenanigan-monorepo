import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";

import { ChallengeLoader, UserLoader } from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionDefinitions } from "../../utils";
import { ChallengeType } from "../challenge/ChallengeType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import UserType from "../user/UserType";
import { load } from "./VoteLoader";
import { IVote } from "./VoteModel";

const VoteType = new GraphQLObjectType<IVote, GraphQLContext>({
  name: "Vote",
  description: "Vote data",
  fields: () => ({
    id: globalIdField("Vote"),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: (vote) => vote._id,
    },
    challenge: {
      type: ChallengeType,
      resolve: (vote, _, context) =>
        ChallengeLoader.load(context, vote.challenge),
    },
    challengeSeries: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (vote) => vote.challengeSeries,
    },
    choice: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (vote) => vote.choice,
    },
    voteType: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (vote) => vote.voteType,
    },
    creator: {
      type: GraphQLNonNull(UserType),
      resolve: (vote, _, context) => UserLoader.load(context, vote.creator),
    },
  }),
  interfaces: () => [nodeInterface],
});

export { VoteType };

registerTypeLoader(VoteType, load);

export const VoteConnection = connectionDefinitions({
  name: "Vote",
  nodeType: VoteType,
});
