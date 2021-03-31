import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField, mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { ChallengeLoader, CommentLoader, PredictionLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { ChallengeType } from '../../challenge/ChallengeType';
import { CommentModel } from '../../comment/CommentModel';
import { CommentType } from '../../comment/CommentType';
import UserModel from '../../user/UserModel';
import PredictionModel from '../PredictionModel';
import PredictionType, { PredictionConnection } from '../PredictionType';

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
			return {
				error: 'User not logged in',
			};
		}
		if (user._id == opponentId) {
			return {
				error: 'Opponent cannot be set to current active user"',
			};
		}
		if (cards.length <= 0) {
			return {
				error: 'Prediction must have at least 1 card',
			};
		}
		const existingChallenge = await ChallengeModel.findOne({
			_id: challengeId,
		});
		if (!existingChallenge) {
			return {
				error: "Challenge doesn't exist",
			};
		}
		const existingPrediction = await PredictionModel.findOne({
			challenge: challengeId,
			creator: user._id,
		});
		if (existingPrediction) {
			existingPrediction.cards.concat(cards);
			const updatedPrediction = await existingPrediction.save();
			return {
				id: updatedPrediction._id,
				challenge: existingChallenge._id,
				opponentPrediction: null,
				comment: null,
				error: null,
			};
		}
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

		const opponentPrediction = await PredictionModel.findById(opponentId);
		if (opponentPrediction) {
			opponentPrediction.opponent = createdPrediction._id;
			await opponentPrediction.save();
		}
		existingChallenge.predictions.push(prediction._id);
		await existingChallenge.save();
		const predictionCreator = await UserModel.findById(user._id);
		if (!predictionCreator) {
			throw new Error('User not found.');
		}
		predictionCreator.predictions.push(prediction._id);
		await predictionCreator.save();
		return {
			id: createdPrediction._id,
			challenge: existingChallenge._id,
			opponentPrediction: opponentPrediction ? opponentPrediction._id : null,
			comment: comment._id,
			error: null,
		};
	},
	outputFields: {
		predictionEdge: {
			type: PredictionConnection.edgeType,
			resolve: async ({ id }, _, context) => {
				// Load new edge from loader
				const prediction = await PredictionLoader.load(context, id);

				// Returns null if no node was loaded
				if (!prediction) {
					return null;
				}

				return {
					cursor: toGlobalId('Prediction', prediction._id),
					node: prediction,
				};
			},
		},
		challenge: {
			type: ChallengeType,
			resolve: async ({ challenge }, _, context) => {
				return await ChallengeLoader.load(context, challenge);
			},
		},
		opponentPrediction: {
			type: PredictionType,
			resolve: async ({ opponentPrediction }, _, context) => {
				return await PredictionLoader.load(context, opponentPrediction);
			},
		},
		comment: {
			type: CommentType,
			resolve: async ({ comment }, _, context) => {
				return await CommentLoader.load(context, comment);
			},
		},
		...errorField,
		...successField,
	},
});
