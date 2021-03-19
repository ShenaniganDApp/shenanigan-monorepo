import { GraphQLObjectType } from 'graphql';

import { ChallengeAdded } from '../../modules/challenge/subscriptions';
import { CommentAdded } from '../../modules/comment/subscriptions';

export const SubscriptionType = new GraphQLObjectType({
	name: 'Subscription',
	fields: {
		ChallengeAdded: ChallengeAdded as any,
		CommentAdded: CommentAdded as any,
	},
});
