import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { EVENTS, pubSub } from '../../../pubSub';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { VoteLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { VoteModel } from '../VoteModel';
import { VoteConnection } from '../VoteType';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';

const voteTypes = ['OUTCOME', 'SKIP'];

type Args = {
	choice: number;
	voteType: string;
	challengeId: string;
	blockTime: number;
};
export const CreateVote = mutationWithClientMutationId({
	name: 'CreateVote',
	inputFields: {
		choice: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		voteType: {
			type: new GraphQLNonNull(GraphQLString),
		},
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		blockTime: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	},
	mutateAndGetPayload: async ({ choice, challengeId, blockTime, voteType }: Args, { user }: GraphQLContext) => {
		if (!user)
			return {
				error: 'Donation must be greater than 0',
			};
		if (voteTypes.indexOf(voteType) === -1)
			return {
				error: 'Vote must be of a valid voting type',
			};

		const fetchedChallenge = await ChallengeModel.findById(challengeId);
		if (!fetchedChallenge)
			return {
				error: 'Challenge not found.',
			};

		const voteExists = await VoteModel.findOne({
			challenge: challengeId,
			creator: user._id,
			challengeSeries: fetchedChallenge.series,
			voteType,
		});
		if (voteExists)
			return {
				error: 'Vote already exists for this user',
			};
		if (user._id === fetchedChallenge.creator)
			return {
				error: 'User cannot vote on a challenge they own',
			};

		const vote = new VoteModel({
			creator: user._id,
			choice,
			challenge: fetchedChallenge,
			challengeSeries: fetchedChallenge.series,
			voteType,
		});

		if (voteType === 'OUTCOME') {
			if (fetchedChallenge.active || fetchedChallenge.live)
				return {
					error: 'Challenge cannot be active or live to outcome vote',
				};
			const voteEnd = fetchedChallenge.votePeriods[fetchedChallenge.series][1];
			if (blockTime > voteEnd)
				return {
					error: 'Vote is already closed',
				};
			fetchedChallenge.outcomeVotes.push(vote._id);
			user.outcomeVotes.push(vote._id);
		}

		if (voteType === 'SKIP') {
			if (choice > 1)
				return {
					error: 'Skip vote choice must be a 0 or 1',
				};
			if (!fetchedChallenge.live)
				return {
					error: 'Challenge must be live to skip vote',
				};
			fetchedChallenge.skipVotes.push(vote._id);
			user.skipVotes.push(vote._id);
		}

		await vote.save();

		await fetchedChallenge.save();
		await user.save();
		await pubSub.publish(EVENTS.VOTE.ADDED, { voteId: vote._id });

		return vote;
	},
	outputFields: {
		voteEdge: {
			type: VoteConnection.edgeType,
			resolve: async ({ id }, _, context) => {
				// Load new edge from loader
				const vote = await VoteLoader.load(context, id);

				// Returns null if no node was loaded
				if (!vote) {
					return null;
				}

				return {
					cursor: toGlobalId('Vote', vote._id),
					node: vote,
				};
			},
		},
		...successField,
		...errorField,
	},
});
