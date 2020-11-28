import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';

export const ToggleActive = mutationWithClientMutationId({
	name: 'ToggleActive',
	inputFields: {
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ challengeId }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const challenge = await ChallengeModel.findOne({ _id: challengeId });
		if (!challenge) {
			throw new Error('Challenge does not exist');
		}
		if (challenge.active) {
			challenge.active = false;
			const result = await challenge.save();
			return { active: result.active };
		}
		if (challenge.options.length < 2) {
			throw new Error('Challenge must have at least two options.');
		}
		challenge.active = true;
		challenge.series += 1;
		const result = await challenge.save();
		return { active: result.active };
	},

	outputFields: {
		active: {
			type: GraphQLNonNull(GraphQLBoolean),
			resolve: ({ active }) => active,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
