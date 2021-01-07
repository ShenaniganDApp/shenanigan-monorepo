import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';

export const AddOptions = mutationWithClientMutationId({
	name: 'AddOptions',
	inputFields: {
		positiveOptions: {
			type: new GraphQLList(GraphQLNonNull(GraphQLString)),
		},
		negativeOptions: {
			type: new GraphQLList(GraphQLNonNull(GraphQLString)),
		},
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ positiveOptions, negativeOptions, challengeId }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const challenge = await ChallengeModel.findById(challengeId);
		if (!challenge) {
			throw new Error('Challenge not found.');
		}

		const newPositiveOptions = await challenge.positiveOptions.concat(positiveOptions);
		const newNegativeOptions = await challenge.negativeOptions.concat(negativeOptions);

		challenge.positiveOptions = newPositiveOptions;
		challenge.negativeOptions = newNegativeOptions;
		const result = await challenge.save();
		return { positiveOptions: result.positiveOptions, negativeOptions: result.negativeOptions };
	},
	outputFields: {
		positiveOptions: {
			type: GraphQLList(GraphQLString),
			resolve: ({ positiveOptions }) => positiveOptions,
		},
		negativeOptions: {
			type: GraphQLList(GraphQLString),
			resolve: ({ negativeOptions }) => negativeOptions,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
