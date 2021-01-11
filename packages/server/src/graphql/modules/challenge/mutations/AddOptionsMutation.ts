import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { ChallengeLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeType } from '../ChallengeType';

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
    return {
      id: result._id,
    };	
	},
	outputFields: {
		challenge:{
		type: ChallengeType,
		resolve: async ({ id }, _, context) => {
			const challenge = await ChallengeLoader.load(context, id);
			return challenge
		}},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
