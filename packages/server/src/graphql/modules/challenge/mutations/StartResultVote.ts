import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ChallengeLoader } from "../../../loaders";
import { EVENTS, pubSub } from "../../../pubSub";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import { ChallengeModel } from "../ChallengeModel";
import { ChallengeType } from "../ChallengeType";

export const StartResultVote = mutationWithClientMutationId({
  name: "StartResultVote",
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
      return {
        error: "User is not logged in",
      };
    }
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!challenge) {
      throw new Error("Challenge does not exist");
    }
    if (user._id !== challenge.creator) {
      return {
        error: "User did not create the challenge",
      };
    }
    if (challenge.active) {
      return {
        error: "Can't start a vote on an active challenge",
      };
    }
    if (challenge.votePeriods.length > challenge.series) {
      return {
        error: "A vote already exists for this challenge",
      };
    }
    challenge.votePeriods.push([blockNumber, blockNumber + 1000]);
    const result = await challenge.save();
    await pubSub.publish(EVENTS.CHALLENGE.RESULT, {
      challengeId: challenge._id,
    });
    return { id: result._id, error: null };
  },

  outputFields: {
    challenge: {
      type: ChallengeType,
      resolve: async ({ id }, _, context) => {
        const challenge = await ChallengeLoader.load(context, id);
        return challenge;
      },
    },
    ...errorField,
    ...successField,
  },
});
