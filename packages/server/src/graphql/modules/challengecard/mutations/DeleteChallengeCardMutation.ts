import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import ChallengeCardModel from "../ChallengeCardModel";

export const DeleteChallengeCard = mutationWithClientMutationId({
  name: "DeleteChallengeCard",
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ id }, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: "User not logged in",
      };
    }
    const card = await ChallengeCardModel.findOne({ _id: id });
    if (!card) {
      return {
        error: "Challenge does not exist",
      };
    }
    const existingCreator = card.creator.toString();
    const creator = user._id.toString();

    if (existingCreator != creator) {
      return {
        error: "User is not creator",
      };
    }
    await ChallengeCardModel.deleteOne({ _id: id });

    return { error: null };
  },
  outputFields: {
    ...successField,
    ...errorField,
  },
});
