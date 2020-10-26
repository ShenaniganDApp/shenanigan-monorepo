import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import ChallengeModel from "../ChallengeModel";

export default mutationWithClientMutationId({
  name: "DeleteChallenge",
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
    if (!challenge) {
      throw new Error("Challenge does not exist");
    }
    const existingCreator = challenge.creator.toString();
    const creator = user._id.toString();

    if (existingCreator != creator) {
      throw new Error("User is not creator");
    }
    await ChallengeModel.deleteOne({ _id: challengeId });
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
