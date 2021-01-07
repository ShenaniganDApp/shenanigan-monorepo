import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';

export const ToggleLive = mutationWithClientMutationId({
	name: 'ToggleLive',
	inputFields: {
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ challengeId, blockNumber }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const challenge = await ChallengeModel.findOne({ _id: challengeId });
		if (!challenge) {
			throw new Error('Challenge does not exist');
		}

		if (!challenge.active) {
			throw new Error('Challenge must be activated to go live');
		}
		const liveChallenge = await ChallengeModel.findOne({ live: true });
		if (liveChallenge) {
			liveChallenge.live = false;
		}
		challenge.live = true;
		const result = await challenge.save();
		return { live: result.live };
	},

	outputFields: {
		live: {
			type: GraphQLNonNull(GraphQLBoolean),
			resolve: ({ live }) => live,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
