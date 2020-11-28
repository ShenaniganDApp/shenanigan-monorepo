import { GraphQLObjectType } from 'graphql';

// import ChallengeSubscriptions from '../../poll/subscriptions';
import * as CommentSubscriptions from '../../modules/comment/subscriptions';

export const SubscriptionType = new GraphQLObjectType({
	name: 'Subscription',
	fields: {
		// ...ChallengeSubscriptions,
		...CommentSubscriptions,
	},
});
