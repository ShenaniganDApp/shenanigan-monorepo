import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import ChallengeModel from "../ChallengeModel";

export default mutationWithClientMutationId({
  name: "ToggleLive",
  inputFields: {
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ challengeId }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    console.log(challenge);
    if (challenge.live) {
      challenge.live = false;
      const result = await challenge.save();
      return { live: result.live };
    }
    if (challenge.options.length < 2) {
      throw new Error("ChallengeModel must have at least two options.");
    }
    challenge.live = true;
    const result = await challenge.save();
    return { live: result.live };
  },

  outputFields: {
    live: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: ({ live }) => live,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
