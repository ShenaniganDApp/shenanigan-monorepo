import { GraphQLObjectType } from "graphql";

// import ChallengeSubscriptions from '../../poll/subscriptions';
import CommentSubscriptions from "../../modules/comment/subscriptions";

export default new GraphQLObjectType({
  name: "Subscription",
  fields: {
    // ...ChallengeSubscriptions,
    ...CommentSubscriptions,
  },
});
