import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
	POLL: {
		ADDED: 'POLL_ADDED',
	},
	COMMENT: {
		ADDED: 'COMMENT_ADDED',
	},
};

export const pubSub = new PubSub();
