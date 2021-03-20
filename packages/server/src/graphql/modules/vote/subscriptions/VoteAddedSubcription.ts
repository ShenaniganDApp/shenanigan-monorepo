import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as VoteLoader from '../VoteLoader';
import { VoteType } from '../VoteType';

type VoteAdded = {
	voteId: string;
};

const VoteAddedSubscription = subscriptionWithClientId<VoteAdded, GraphQLContext>({
	name: 'VoteAdded',
	inputFields: {},
	outputFields: {
		vote: {
			type: VoteType,
			resolve: async ({ id }: any, _, context) => {
				const vote = await VoteLoader.load(context, id);
				return vote;
			},
		},
	},
	subscribe: (input, context) => {
		// eslint-disable-next-line
		console.log('Subscribe VoteAddedSubscription: ', input);

		return pubSub.asyncIterator(EVENTS.VOTE.ADDED);
	},
	getPayload: async (obj: VoteAdded) => {
		return {
			id: obj.voteId,
		};
	},
});

export { VoteAddedSubscription as VoteAdded };
