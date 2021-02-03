import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import {
	CommentLoader,
	DonationLoader,
	PredictionLoader,
	UserLoader,
	ChallengeCardLoader,
	VoteLoader,
} from '../../loaders';
import { GraphQLContext } from '../../TypeDefinition';
import { connectionArgs, connectionDefinitions, mongooseIDResolver, withFilter } from '../../utils';
import { ChallengeCardConnection } from '../challengecard/ChallengeCardType';
import { CommentConnection } from '../comment/CommentType';
import { DonationModel } from '../donation/DonationModel';
import { DonationConnection } from '../donation/DonationType';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { PredictionConnection } from '../prediction/PredictionType';
import UserType from '../user/UserType';
import { VoteConnection } from '../vote/VoteType';
import { load } from './ChallengeLoader';
import { IChallenge } from './ChallengeModel';

const ChallengeType = new GraphQLObjectType<IChallenge, GraphQLContext>({
	name: 'Challenge',
	description: 'Challenge data',
	fields: () => ({
		id: globalIdField('Challenge'),
		...mongooseIDResolver,
		address: {
			type: GraphQLNonNull(GraphQLString),
			resolve: (challenge) => challenge.address,
		},
		title: {
			type: GraphQLNonNull(GraphQLString),
			resolve: (challenge) => challenge.title,
		},
		content: {
			type: GraphQLString,
			resolve: (challenge) => challenge.content,
		},
		active: {
			type: GraphQLNonNull(GraphQLBoolean),
			resolve: (challenge) => challenge.active,
		},
		live: {
			type: GraphQLNonNull(GraphQLBoolean),
			resolve: (challenge) => challenge.live,
		},
		series: {
			type: GraphQLNonNull(GraphQLInt),
			resolve: (challenge) => challenge.series,
		},
		donations: {
			type: DonationConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const donations = await DonationLoader.loadAll(context, withFilter(args, { challenge: challenge._id }));
				return donations;
			},
		},
		totalDonations: {
			type: GraphQLNonNull(GraphQLFloat),
			resolve: async (challenge, _, context) => {
				const totalAggregate = await DonationModel.aggregate([
					{
						$match: { challenge: challenge._id },
					},
					{
						$group: {
							_id: null,
							total: {
								$sum: '$amount',
							},
						},
					},
				]);
				return totalAggregate.length ? totalAggregate[0].total : 0;
			},
		},
		creator: {
			type: GraphQLNonNull(UserType),
			resolve: (challenge, _, context) => {
				return UserLoader.load(context, challenge.creator);
			},
		},
		positiveOptions: {
			type: GraphQLNonNull(GraphQLList(GraphQLString)),
			resolve: (challenge) => challenge.positiveOptions,
		},
		negativeOptions: {
			type: GraphQLNonNull(GraphQLList(GraphQLString)),
			resolve: (challenge) => challenge.negativeOptions,
		},
		predictions: {
			type: PredictionConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const predictions = await PredictionLoader.loadAll(
					context,
					withFilter(args, { challenge: challenge._id })
				);
				return predictions;
			},
		},
		comments: {
			type: CommentConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const comments = await CommentLoader.loadAll(context, withFilter(args, { challenge: challenge._id }));
				return comments;
			},
		},
		challengeCards: {
			type: ChallengeCardConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const challengeCards = await ChallengeCardLoader.loadAll(
					context,
					withFilter(args, { challenge: challenge._id })
				);
				return challengeCards;
			},
		},
		votePeriods: {
			type: GraphQLNonNull(GraphQLList(GraphQLList(GraphQLInt))),
			resolve: (challenge) => challenge.votePeriods,
		},
		outcomeVotes: {
			type: VoteConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const votes = await VoteLoader.loadAll(
					context,
					withFilter(args, { challenge: challenge._id, voteType: 'OUTCOME' })
				);
				return votes;
			},
		},
		skipVotes: {
			type: VoteConnection.connectionType,
			args: {
				...connectionArgs,
			},
			resolve: async (challenge, args, context) => {
				const votes = await VoteLoader.loadAll(
					context,
					withFilter(args, { challenge: challenge._id, voteType: 'SKIP' })
				);
				return votes;
			},
		},
	}),
	interfaces: () => [nodeInterface],
});

export { ChallengeType };

registerTypeLoader(ChallengeType, load);

export const ChallengeConnection = connectionDefinitions({
	name: 'Challenge',
	nodeType: ChallengeType,
});
