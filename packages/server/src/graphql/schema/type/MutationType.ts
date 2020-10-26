import { GraphQLObjectType } from "graphql";

import ChallengeMutations from "../../modules/challenge/mutations";
import CommentMutations from "../../modules/comment/mutations";
import DonationMutations from "../../modules/donation/mutations";
import PredictionMutations from "../../modules/prediction/mutations";
import UserMutations from "../../modules/user/mutations";

export default new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...UserMutations,
    ...ChallengeMutations,
    ...PredictionMutations,
    ...CommentMutations,
    ...DonationMutations,
  }),
});
