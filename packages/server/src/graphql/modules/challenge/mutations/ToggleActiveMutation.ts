import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ChallengeLoader } from "../../../loaders";
import { EVENTS, pubSub } from "../../../pubSub";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import { ChallengeModel } from "../ChallengeModel";
import { ChallengeType } from "../ChallengeType";

export const ToggleActive = mutationWithClientMutationId({
  name: "ToggleActive",
  inputFields: {
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ challengeId }, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: "User not logged in",
      };
    }
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!challenge) {
      return {
        error: "Challenge does not exist",
      };
    }
    if (user._id !== challenge.creator) {
      return {
        error: "User did not create the challenge",
      };
    }
    if (challenge.active) {
      challenge.active = false;
      const result = await challenge.save();
      await pubSub.publish(EVENTS.CHALLENGE.ACTIVE, {
        challengeId: challenge._id,
      });
      return { id: result._id, error: null };
    }
    const activeChallengeExists = await ChallengeModel.findOne({
      creator: user._id,
      active: true,
    });
    if (activeChallengeExists) {
      return {
        error: "User already has an active challenge",
      };
    }
    challenge.active = true;
    const result = await challenge.save();
    await pubSub.publish(EVENTS.CHALLENGE.ACTIVE, {
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
