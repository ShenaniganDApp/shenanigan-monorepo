import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
	CHALLENGE: {
		ADDED: 'CHALLENGE_ADDED',
		RESULT: 'CHALLENGE_RESULT_STARTED',
	},
	COMMENT: {
		ADDED: 'COMMENT_ADDED',
	},
	VOTE: {
		ADDED: 'VOTE_ADDED',
	},
};

export const pubSub = new PubSub();
