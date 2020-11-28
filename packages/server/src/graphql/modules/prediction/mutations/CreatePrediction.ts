import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString
} from "graphql";
import { globalIdField, mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import ChallengeModel from "../../challenge/ChallengeModel";
import CommentModel from "../../comment/CommentModel";
import UserModel from "../../user/UserModel";
import PredictionModel from "../PredictionModel";

export default mutationWithClientMutationId({
  name: "CreatePrediction",
  inputFields: {
    cards: {
      type: new GraphQLNonNull(GraphQLList(GraphQLString))
    },
    option: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    opponentId: {
      type: GraphQLString
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    content: {
      type: GraphQLString
    },
    blockTimestamp: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  mutateAndGetPayload: async (
    { cards, option, challengeId, content, opponentId, blockTimestamp },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    if (user._id == opponentId) {
      throw new Error("Opponent cannot be set to current active user");
    }
    if (cards.length <= 0) {
      throw new Error("Prediction must have at least 1 card");
    }
    const existingChallenge = await ChallengeModel.findOne({
      _id: challengeId
    });
    if (!existingChallenge) {
      throw new Error("Challenge doesnt exist");
    }
    const existingPrediction = await PredictionModel.findOne({
      challenge: challengeId,
      creator: user._id
    });
    if (existingPrediction) {
      existingPrediction.cards.concat(cards);
      const updatedPrediction = await existingPrediction.save();
      return { cards: updatedPrediction.cards };
    }
    const comment = new CommentModel({
      id: globalIdField("Comment"),
      content,
      creator: user._id,
      challenge: challengeId
    });
    const createdComment = await comment.save();
    existingChallenge.comments.push(createdComment._id);
    const prediction = new PredictionModel({
      id: globalIdField("Prediction"),
      cards,
      option,
      creator: user._id,
      opponent: opponentId,
      challenge: challengeId,
      comment,
      blockTimestamp
    });
    const createdPrediction = await prediction.save();

    const opponentPrediction = await PredictionModel.findById(opponentId);
    if (opponentPrediction) {
      console.log("opponentPrediction: ", opponentPrediction);

      opponentPrediction.opponent = createdPrediction._id;
      await opponentPrediction.save();
    }
    existingChallenge.predictions.push(prediction._id);
    await existingChallenge.save();
    const predictionCreator = await UserModel.findById(user._id);
    if (!predictionCreator) {
      throw new Error("User not found.");
    }
    predictionCreator.predictions.push(prediction._id);
    await predictionCreator?.save();
    return {
      cards: createdPrediction.cards,
      opponent: createdPrediction.opponent,
      option: createdPrediction.option
    };
  },
  outputFields: {
    cards: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ cards }) => cards
    },
    option: {
      type: GraphQLInt,
      resolve: ({ option }) => option
    },
    opponent: {
      type: GraphQLString,
      resolve: ({ opponent }) => opponent
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
