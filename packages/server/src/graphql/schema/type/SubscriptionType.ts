import { GraphQLObjectType } from "graphql";

// import ChallengeSubscriptions from '../../poll/subscriptions';
import { CommentAdded } from "../../modules/comment/subscriptions";

export const SubscriptionType = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    // ...ChallengeSubscriptions,
    CommentAdded: CommentAdded as any
  }
});
