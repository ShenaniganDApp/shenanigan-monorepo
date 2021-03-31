import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ChallengeLoader } from "../../../loaders";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import { ChallengeModel } from "../ChallengeModel";
import { ChallengeType } from "../ChallengeType";

export const AddOptions = mutationWithClientMutationId({
  name: "AddOptions",
  inputFields: {
    positiveOptions: {
      type: new GraphQLList(GraphQLNonNull(GraphQLString)),
    },
    negativeOptions: {
      type: new GraphQLList(GraphQLNonNull(GraphQLString)),
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { positiveOptions, negativeOptions, challengeId },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      return {
        error: "User not logged in",
      };
    }

    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      return {
        error: "Challenge not found",
      };
    }
    if (user.id !== challenge.creator) {
      return {
        error: "User did not create challenge",
      };
    }

    const newPositiveOptions = await challenge.positiveOptions.concat(
      positiveOptions
    );
    const newNegativeOptions = await challenge.negativeOptions.concat(
      negativeOptions
    );

    challenge.positiveOptions = newPositiveOptions;
    challenge.negativeOptions = newNegativeOptions;
    const result = await challenge.save();
    return {
      id: result._id,
      error: null,
    };
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
