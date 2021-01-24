import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
// import { transformVote } from '../../merge');
// import { pubSub, COMMENTS } from '../../pubSub');
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { VoteLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { VoteModel } from '../VoteModel';
import { VoteConnection } from '../VoteType';

const voteTypes = ['OUTCOME', 'SKIP'];

type Args = {
	choice: number;
	voteType: string;
	challengeId: string;
	blockNumber: number;
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
		blockNumber: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	},
	mutateAndGetPayload: async ({ choice, challengeId, blockNumber, voteType }: Args, { user }: GraphQLContext) => {
		if (!user) throw new Error('Unauthenticated');
		if (voteTypes.indexOf(voteType) === -1) throw new Error('Vote must be of a valid voting type');

		try {
			const fetchedChallenge = await ChallengeModel.findById(challengeId);
			if (!fetchedChallenge) throw new Error('Challenge not found.');

			const voteExists = await VoteModel.findOne({
				challenge: challengeId,
				creator: user._id,
				challengeSeries: fetchedChallenge.series,
				voteType,
			});
			if (voteExists) throw new Error('Vote already exists for this user');
			if (user._id === fetchedChallenge.creator) throw new Error('User cannot vote on a challenge they own');

			const vote = new VoteModel({
				creator: user._id,
				choice,
				challenge: fetchedChallenge,
				challengeSeries: fetchedChallenge.series,
				voteType,
			});

			if (voteType === 'OUTCOME') {
				if (fetchedChallenge.active || fetchedChallenge.live)
					throw new Error('Challenge cannot be active or live to outcome vote');
				const voteEnd = fetchedChallenge.votePeriods[fetchedChallenge.series][1];
				if (blockNumber > voteEnd) throw new Error('Vote is already closed');
				fetchedChallenge.outcomeVotes.push(vote._id);
				user.outcomeVotes.push(vote._id);
			}

			if (voteType === 'SKIP') {
				if (choice > 1) throw new Error('Skip vote choice must be a 0 or 1');
				if (!fetchedChallenge.live) throw new Error('Challenge must be live to skip vote');
				fetchedChallenge.skipVotes.push(vote._id);
				user.skipVotes.push(vote._id);
			}

			await vote.save();

			await fetchedChallenge.save();
			await user.save();
			return vote;
		} catch (err) {
			throw new Error(err);
		}
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
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
