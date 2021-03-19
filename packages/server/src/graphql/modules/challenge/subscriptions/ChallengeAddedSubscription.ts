import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as ChallengeLoader from '../ChallengeLoader';
import { ChallengeType } from '../ChallengeType';

type ChallengeAdded = {
	challengeId: string;
};

const ChallengeAddedSubscription = subscriptionWithClientId<ChallengeAdded, GraphQLContext>({
	name: 'ChallengeAdded',
	inputFields: {},
	outputFields: {
		challenge: {
			type: ChallengeType,
			resolve: async ({ id }: any, _, context) => {
				const challenge = await ChallengeLoader.load(context, id);
				return challenge;
			},
		},
	},
	subscribe: (input, context) => {
		// eslint-disable-next-line
		console.log('Subscribe ChallengeAddedSubscription: ', input);

		return pubSub.asyncIterator(EVENTS.CHALLENGE.ADDED);
	},
	getPayload: async (obj: ChallengeAdded) => {
		return {
			id: obj.challengeId,
		};
	},
});

export { ChallengeAddedSubscription as ChallengeAdded };
