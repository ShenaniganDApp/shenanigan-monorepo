import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as ChallengeLoader from '../ChallengeLoader';
import { ChallengeType } from '../ChallengeType';

type ActiveToggled = {
	challengeId: string;
};

const ActiveToggledSubscription = subscriptionWithClientId<ActiveToggled, GraphQLContext>({
	name: 'ActiveToggled',
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
		console.log('Subscribe ActiveToggledSubscription: ', input);

		return pubSub.asyncIterator(EVENTS.CHALLENGE.ACTIVE);
	},
	getPayload: async (obj: ActiveToggled) => {
		return {
			id: obj.challengeId,
		};
	},
});

export { ActiveToggledSubscription as ActiveToggled };
