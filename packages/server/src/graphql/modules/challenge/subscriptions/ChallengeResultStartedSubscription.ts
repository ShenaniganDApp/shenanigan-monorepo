import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as ChallengeLoader from '../ChallengeLoader';
import { ChallengeType } from '../ChallengeType';

type ChallengeResult = {
	challengeId: string;
};

const ChallengeResultSubscription = subscriptionWithClientId<ChallengeResult, GraphQLContext>({
	name: 'ChallengeResult',
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
		console.log('Subscribe ChallengeResultStartedSubscription: ', input);

		return pubSub.asyncIterator(EVENTS.CHALLENGE.RESULT);
	},
	getPayload: async (obj: ChallengeResult) => {
		return {
			id: obj.challengeId,
		};
	},
});

export { ChallengeResultSubscription as ChallengeResultStarted };
