import { GraphQLObjectType } from 'graphql';

// import WagerSubscriptions from '../../poll/subscriptions';
import CommentSubscriptions from '../../modules/comment/subscriptions';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    // ...WagerSubscriptions,
    ...CommentSubscriptions,
  },
});
