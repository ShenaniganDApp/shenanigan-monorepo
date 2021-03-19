// import { pubSub, EVENTS } from ../../pubSub');
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { ChallengeLoader } from '../../../loaders';
import { EVENTS, pubSub } from '../../../pubSub';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeConnection } from '../ChallengeType';

type Args = {
	address: string;
	title: string;
	content: string;
	positiveOptions: string[];
	negativeOptions: string[];
};

export const CreateChallenge = mutationWithClientMutationId({
	name: 'CreateChallenge',
	inputFields: {
		address: {
			type: new GraphQLNonNull(GraphQLString),
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
		positiveOptions: {
			type: new GraphQLNonNull(GraphQLList(GraphQLString)),
		},
		negativeOptions: {
			type: new GraphQLNonNull(GraphQLList(GraphQLString)),
		},
	},
	mutateAndGetPayload: async (
		{ address, title, content, positiveOptions, negativeOptions }: Args,
		{ user }: GraphQLContext
	) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		if (positiveOptions.length < 1 || negativeOptions.length < 1) {
			throw new Error('Challenge must have at least one positive and negative option.');
		}
		const creator = user._id;

		const existingChallenge = await ChallengeModel.findOne({
			creator,
			active: true,
		});
		if (existingChallenge) {
			throw new Error('User already has open challenge');
		}

		const challenge = new ChallengeModel({
			address,
			title,
			content,
			positiveOptions,
			negativeOptions,
			creator,
		});
		try {
			await challenge.save();
			user.createdChallenges.push(challenge._id);
			await pubSub.publish(EVENTS.CHALLENGE.ADDED, { challengeId: challenge._id });

			return challenge;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	outputFields: {
		challengeEdge: {
			type: ChallengeConnection.edgeType,
			resolve: async ({ id }, _, context) => {
				// Load new edge from loader
				const challenge = await ChallengeLoader.load(context, id);

				// Returns null if no node was loaded
				if (!challenge) {
					return null;
				}

				return {
					cursor: toGlobalId('Challenge', challenge._id),
					node: challenge,
				};
			},
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
