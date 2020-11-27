import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import ChallengeCardModel from '../ChallengeCardModel';

export const DeleteChallengeCard = mutationWithClientMutationId({
	name: 'DeleteChallengeCard',
	inputFields: {
		cardId: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ cardId }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const card = await ChallengeCardModel.findOne({ _id: cardId });
		if (!card) {
			throw new Error('Challenge does not exist');
		}
		const existingCreator = card.creator.toString();
		const creator = user._id.toString();

		if (existingCreator != creator) {
			throw new Error('User is not creator');
		}
		await ChallengeCardModel.deleteOne({ _id: cardId });
	},
	outputFields: {
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
