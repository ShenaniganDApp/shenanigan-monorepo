import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ChallengeLoader } from "../../../loaders";
import { EVENTS, pubSub } from "../../../pubSub";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import { ChallengeModel } from "../ChallengeModel";
import { ChallengeType } from "../ChallengeType";

export const ToggleLive = mutationWithClientMutationId({
  name: "ToggleLive",
  inputFields: {
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ challengeId }, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: "User is not logged in",
      };
    }
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!challenge) {
      return {
        error: "Challenge does not exist",
      };
    }
    if (user._id.toString() !== challenge.creator.toString()) {
      return {
        error: "User did not create the challenge",
      };
    }

    if (!challenge.active) {
      return {
        error: "Challenge must be activated to go live",
      };
    }

    const liveChallenge = await ChallengeModel.findOne({ live: true });

    if (liveChallenge) {
      liveChallenge.live = false;
      liveChallenge.active = false;
      const result = await liveChallenge.save();
      await pubSub.publish(EVENTS.CHALLENGE.LIVE, {
        challengeId: challenge._id,
        liveChallengeId: liveChallenge._id,
      });
      if (liveChallenge._id === challengeId) {
        return { id: result._id, error: null };
      }
    }
    await pubSub.publish(EVENTS.CHALLENGE.LIVE, {
      challengeId: challenge._id,
    });
    challenge.live = true;
    const result = await challenge.save();
    return { id: result._id, error: null };
  },

  outputFields: {
    challenge: {
      type: ChallengeType,
      resolve: async ({ id }, _, context) => {
        return await ChallengeLoader.load(context, id);
      },
    },
    ...errorField,
    ...successField,
  },
});
