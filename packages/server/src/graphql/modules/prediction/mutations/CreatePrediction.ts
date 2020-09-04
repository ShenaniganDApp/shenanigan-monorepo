import PredictionModel from '../PredictionModel';
import ChallengeModel from '../../challenge/ChallengeModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel';

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import { GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull, GraphQLScalarType, GraphQLList } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
	name: 'CreatePrediction',
	inputFields: {
		cards: {
			type: new GraphQLNonNull(GraphQLList(GraphQLString)),
		},
		option: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		opponentId: {
			type: GraphQLString,
		},
		challengeId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		content: {
			type: GraphQLString,
		},
		blockTimestamp: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	},
	mutateAndGetPayload: async (
    { cards, option, challengeId, content, opponentId, blockTimestamp },
		{ user }: GraphQLContext
	) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		if (cards.length <= 0) {
			throw new Error('Prediction must have at least 1 card');
		}
		const existingChallenge = await ChallengeModel.findOne({ _id: challengeId });
		if (!existingChallenge) {
			throw new Error('Challenge doesnt exist');
		}
		const creator = await UserModel.findOne({ _id: user._id });
		const existingPrediction = await PredictionModel.findOne({
			challenge: challengeId,
		});
		if (existingPrediction) {
			existingPrediction.cards.concat(cards);
			const updatedPrediction = await existingPrediction.save();
			return { cards: updatedPrediction.cards };
    }
    console.log('opponentId: ', opponentId);
		const comment = new CommentModel({
			id: globalIdField('Comment'),
			content,
			creator: user._id,
			challenge: challengeId,
		});
		const createdComment = await comment.save();
		existingChallenge.comments.push(createdComment._id);
		const prediction = new PredictionModel({
			id: globalIdField('Prediction'),
			cards,
			option,
			creator: user._id,
			opponent: opponentId,
			challenge: challengeId,
			comment,
			blockTimestamp,
		});

		const createdPrediction = await prediction.save();
		existingChallenge.predictions.push(prediction._id);
		await existingChallenge.save();
		const challengeCreator = await UserModel.findById(user._id);
		if (!challengeCreator) {
			throw new Error('User not found.');
		}
		challengeCreator.predictions.push(prediction._id);
		await creator.save();
		return {
			cards: createdPrediction.cards,
			opponent: createdPrediction.opponent,
			option: createdPrediction.option,
		};
	},
	outputFields: {
		cards: {
			type: new GraphQLList(GraphQLString),
			resolve: ({ cards }) => cards,
		},
		option: {
			type: GraphQLInt,
			resolve: ({ option }) => option,
		},
		opponent: {
			type: GraphQLString,
			resolve: ({ opponent }) => opponent,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
