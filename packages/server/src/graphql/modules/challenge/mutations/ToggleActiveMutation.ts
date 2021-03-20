import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { ChallengeLoader } from '../../../loaders';
import { EVENTS, pubSub } from '../../../pubSub';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeType } from '../ChallengeType';

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
			await pubSub.publish(EVENTS.CHALLENGE.ACTIVE, { challengeId: challenge._id });
			return { id: result._id };
		}
		const activeChallengeExists = await ChallengeModel.findOne({ creator: user._id, active: true });
		if (activeChallengeExists) {
			throw new Error('User already has an active challenge');
		}
		challenge.active = true;
		const result = await challenge.save();
		await pubSub.publish(EVENTS.CHALLENGE.ACTIVE, { challengeId: challenge._id });

		return { id: result._id };
	},

	outputFields: {
		challenge: {
			type: ChallengeType,
			resolve: async ({ id }, _, context) => {
				const challenge = await ChallengeLoader.load(context, id);
				return challenge;
			},
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
