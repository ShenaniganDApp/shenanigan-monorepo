import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as ChallengeLoader from '../ChallengeLoader';
import { ChallengeType } from '../ChallengeType';

type LiveToggled = {
	challengeId: string;
	liveChallengeId?: string;
};

const LiveToggledSubscription = subscriptionWithClientId<LiveToggled, GraphQLContext>({
	name: 'LiveToggled',
	inputFields: {},
	outputFields: {
		challenge: {
			type: ChallengeType,
			resolve: async ({ id }: any, _, context) => {
				const challenge = await ChallengeLoader.load(context, id);
				return challenge;
			},
		},
		liveChallenge: {
			type: ChallengeType,
			resolve: async ({ liveId }: any, _, context) => {
				if (liveId) {
					const challenge = await ChallengeLoader.load(context, liveId);
					return challenge;
				} else {
					return null;
				}
			},
		},
	},
	subscribe: (input, context) => {
		// eslint-disable-next-line
		console.log('Subscribe LiveToggledSubscription: ', input);

		return pubSub.asyncIterator(EVENTS.CHALLENGE.ACTIVE);
	},
	getPayload: async (obj: LiveToggled) => {
		return {
			id: obj.challengeId,
			liveId: obj.liveChallengeId,
		};
	},
});

export { LiveToggledSubscription as LiveToggled };
