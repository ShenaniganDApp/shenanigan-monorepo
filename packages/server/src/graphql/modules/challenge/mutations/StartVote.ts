import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { ChallengeModel } from "../ChallengeModel";

export const StartVote = mutationWithClientMutationId({
  name: "StartVote",
  inputFields: {
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    blockNumber: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  mutateAndGetPayload: async (
    { challengeId, blockNumber },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!challenge) {
      throw new Error("Challenge does not exist");
    }
    if (challenge.active) {
      throw new Error("Can't start a vote on an active challenge");
    }
    if (challenge.votePeriods.length > challenge.series) {
      throw new Error("A vote already exists for this challenge");
    }
    challenge.votePeriods.push([blockNumber, blockNumber + 1000]);
    const result = await challenge.save();
    return { votePeriod: result.votePeriods[challenge.series] };
  },

  outputFields: {
    votePeriod: {
      type: GraphQLNonNull(GraphQLList(GraphQLInt)),
      resolve: ({ votePeriod }) => votePeriod,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
