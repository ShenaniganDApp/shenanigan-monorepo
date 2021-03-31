// import { pubSub, EVENTS } from ../../pubSub');
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { ChallengeCardLoader, ChallengeLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { ChallengeType } from '../../challenge/ChallengeType';
import ChallengeCardModel from '../ChallengeCardModel';
import { ChallengeCardConnection } from '../ChallengeCardType';

export const CreateChallengeCard = mutationWithClientMutationId({
	name: 'CreateChallengeCard',
	inputFields: {
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
		content: {
			type: GraphQLString,
		},
		address: {
			type: new GraphQLNonNull(GraphQLString),
		},
		ipfs: {
			type: new GraphQLNonNull(GraphQLString),
		},
		streamUrl: {
			type: new GraphQLNonNull(GraphQLString),
		},
		price: {
			type: new GraphQLNonNull(GraphQLFloat),
		},
		result: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		totalMint: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		blockTime: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	},
	mutateAndGetPayload: async (
		{ title, content, address, ipfs, streamUrl, price, result, totalMint, challengeId, blockTime },
		{ user }: GraphQLContext
	) => {
		if (!user) {
			return {
				error: 'User is not logged ins',
			};
		}
		if (totalMint < 1) {
			return {
				error: 'Attempted to mint 0 cards',
			};
		}

		if (price <= 0) {
			return {
				error: 'Cannot set a price at 0',
			};
		}
		const creator = user._id;
		const challenge = await ChallengeModel.findOne({ _id: challengeId });
		if (!challenge) {
			return {
				error: 'Challenge does not exist',
			};
		}
		if (user._id !== creator) {
			return {
				error: 'User did not create the challenge',
			};
		}
		if (challenge.active) {
			return {
				error: "Can't add a card to an active challenge",
			};
		}
		const endVote = challenge.votePeriods[challenge.series][1];
		if (endVote > blockTime) {
			return {
				error: 'Challenge vote has not finished',
			};
		}
		const challengeCard = await new ChallengeCardModel({
			title,
			content,
			address,
			ipfs,
			streamUrl,
			price,
			result,
			totalMint,
			creator,
			challenge: challengeId,
		}).save();

		user.challengeCards.push(challengeCard._id);
		await user.save();
		challenge.challengeCards.push(challengeCard._id);
		challenge.series += 1;
		await challenge.save();
		// await pubSub.publish(EVENTS.POLL.ADDED, { ChallengeAdded: { challenge } });
		return { id: challengeCard._id, challenge: challenge._id, error: null };
	},
	outputFields: {
		challengeCardEdge: {
			type: ChallengeCardConnection.edgeType,
			resolve: async ({ id }, _, context) => {
				// Load new edge from loader
				const challengeCard = await ChallengeCardLoader.load(context, id);

				// Returns null if no node was loaded
				if (!challengeCard) {
					return null;
				}

				return {
					cursor: toGlobalId('ChallengeCard', challengeCard._id),
					node: challengeCard,
				};
			},
		},
		challenge: {
			type: ChallengeType,
			resolve: async ({ challenge }, _, context) => {
				return await ChallengeLoader.load(context, challenge);
			},
		},
		...errorField,
		...successField,
	},
});
