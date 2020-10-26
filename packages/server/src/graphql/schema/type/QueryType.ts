import { GraphQLObjectType } from "graphql";

import ChallengeQueries from "../../modules/challenge/queries/challenges";
import CommentQueries from "../../modules/comment/queries/comments";
import DonationQueries from "../../modules/donation/queries/donations";
import { nodeField, nodesField } from "../../modules/node/typeRegister";
import PredictionQueries from "../../modules/prediction/queries/predictions";
import UserQueries from "../../modules/user/queries/users";

export default new GraphQLObjectType({
  name: "Query",
  description: "The root of all... queries",
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...UserQueries,
    ...ChallengeQueries,
    ...PredictionQueries,
    ...DonationQueries,
    ...CommentQueries,
  }),
});
