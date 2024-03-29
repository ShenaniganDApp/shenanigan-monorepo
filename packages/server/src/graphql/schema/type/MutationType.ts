import { GraphQLObjectType } from "graphql";

import * as ChallengeMutations from "../../modules/challenge/mutations";
import * as ChallengeCardMutations from "../../modules/challengecard/mutations";
import * as CommentMutations from "../../modules/comment/mutations";
import * as DonationMutations from "../../modules/donation/mutations";
import PredictionMutations from "../../modules/prediction/mutations";
import * as UserMutations from "../../modules/user/mutations";
import * as VoteMutations from "../../modules/vote/mutations";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...UserMutations,
    ...ChallengeMutations,
    ...PredictionMutations,
    ...CommentMutations,
    ...DonationMutations,
    ...ChallengeCardMutations,
    ...VoteMutations,
  }),
});
