import PredictionModel from '../PredictionModel';
import ChallengeModel from '../../challenge/ChallengeModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel'

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
  name: 'CreatePrediction',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    option: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ amount, option, challengeId, content }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }
    if (amount <= 0) {
      throw new Error('Not a valid prediction amount');
    }
    const existingChallenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!existingChallenge.live) {
      throw new Error('Challenge is not open');
    }
    const creator = await UserModel.findOne({_id:user._id});
    const existingPrediction = await PredictionModel.findOne({
      challenge: challengeId,
    });
    if (existingPrediction) {
      existingPrediction.amount += amount;
      const updatedPrediction = await existingPrediction.save();
      return { amount: updatedPrediction.amount };
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
      amount,
      option,
      creator: user._id,
      challenge: challengeId,
      comment,
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
      amount: createdPrediction.amount,
      option: createdPrediction.option,
    };
  },
  outputFields: {
    amount: {
      type: GraphQLFloat,
      resolve: ({ amount }) => amount,
    },
    option: {
      type: GraphQLInt,
      resolve: ({ option }) => option,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
