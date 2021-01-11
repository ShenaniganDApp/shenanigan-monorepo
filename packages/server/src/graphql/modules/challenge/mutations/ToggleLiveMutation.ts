import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { ChallengeLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeType } from '../ChallengeType';

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
			liveChallenge.active = false;
			const result = await liveChallenge.save();
			if (liveChallenge._id === challengeId) {
				return { id: result._id };
			}
		}
		challenge.live = true;
		const result = await challenge.save();
		return { id: result._id };
	},

	outputFields: {
		challenge:{
			type: ChallengeType,
			resolve: async ({ id }, _, context) => {
				return await ChallengeLoader.load(context, id);
			}},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
