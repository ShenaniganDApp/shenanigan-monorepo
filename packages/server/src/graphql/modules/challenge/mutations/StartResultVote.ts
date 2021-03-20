import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { ChallengeLoader } from '../../../loaders';
import { EVENTS, pubSub } from '../../../pubSub';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeType } from '../ChallengeType';

export const StartResultVote = mutationWithClientMutationId({
	name: 'StartResultVote',
	inputFields: {
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		blockNumber: {
			type: new GraphQLNonNull(GraphQLInt),
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
		if (challenge.active) {
			throw new Error("Can't start a vote on an active challenge");
		}
		if (challenge.votePeriods.length > challenge.series) {
			throw new Error('A vote already exists for this challenge');
		}
		challenge.votePeriods.push([blockNumber, blockNumber + 1000]);
		const result = await challenge.save();
		await pubSub.publish(EVENTS.CHALLENGE.RESULT, { challengeId: challenge._id });
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
