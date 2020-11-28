import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';

export const AddOptions = mutationWithClientMutationId({
	name: 'AddOptions',
	inputFields: {
		options: {
			type: new GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
		},
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ options, challengeId }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const challenge = await ChallengeModel.findById(challengeId);
		if (!challenge) {
			throw new Error('Challenge not found.');
		}

		const addedOptions = await challenge.options.concat(options);
		if (addedOptions.length < 2) {
			throw new Error('Challenge must have at least two options.');
		}
		challenge.options = addedOptions;
		const result = await challenge.save();
		return { options: result.options };
	},
	outputFields: {
		options: {
			type: GraphQLList(GraphQLString),
			resolve: ({ options }) => options,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
