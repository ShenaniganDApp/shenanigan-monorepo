import { GraphQLObjectType } from 'graphql';

import { ChallengeAdded, ChallengeResultStarted } from '../../modules/challenge/subscriptions';
import { CommentAdded } from '../../modules/comment/subscriptions';
import { VoteAdded } from '../../modules/vote/subscriptions';

export const SubscriptionType = new GraphQLObjectType({
	name: 'Subscription',
	fields: {
		ChallengeAdded: ChallengeAdded as any,
		ChallengeResultStarted: ChallengeResultStarted as any,
		CommentAdded: CommentAdded as any,
		VoteAdded: VoteAdded as any,
	},
});
