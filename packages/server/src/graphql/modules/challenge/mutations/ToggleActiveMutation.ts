import {
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ChallengeLoader } from "../../../loaders";

import { GraphQLContext } from "../../../TypeDefinition";
import { ChallengeModel } from "../ChallengeModel";
import { ChallengeType } from "../ChallengeType";

export const ToggleActive = mutationWithClientMutationId({
  name: "ToggleActive",
  inputFields: {
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { challengeId },
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
      challenge.active = false;
      const result = await challenge.save();
      return { id: result._id };
    }
    challenge.active = true;
    const result = await challenge.save();
    return { id: result._id };
  },

  outputFields: {
		challenge:{
      type: ChallengeType,
      resolve: async ({ id }, _, context) => {
        const challenge = await ChallengeLoader.load(context, id);
        return challenge
      }},
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
