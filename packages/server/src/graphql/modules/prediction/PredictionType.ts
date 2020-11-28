import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { globalIdField } from "graphql-relay";

import {
  ChallengeLoader,
  CommentLoader,
  PredictionLoader,
  UserLoader
} from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionArgs, connectionDefinitions } from "../../utils";
import { ChallengeType } from "../challenge/ChallengeType";
import { CommentType } from "../comment/CommentType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import UserType from "../user/UserType";
import { load } from "./PredictionLoader";
import { IPrediction } from "./PredictionModel";

const PredictionType = new GraphQLObjectType<IPrediction, GraphQLContext>({
  name: "Prediction",
  description: "Prediction data",
  fields: () => ({
    id: globalIdField("Prediction"),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: prediction => prediction._id
    },
    cards: {
      type: GraphQLNonNull(GraphQLList(GraphQLString)),
      resolve: prediction => prediction.cards
    },
    option: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: prediction => prediction.option
    },
    opponent: {
      type: PredictionType,
      resolve: (prediction, _, context) => {
        return PredictionLoader.load(context, prediction.opponent);
      }
    },
    challenge: {
      type: ChallengeType,
      resolve: (prediction, _, context) => {
        return ChallengeLoader.load(context, prediction.challenge);
      }
    },
    creator: {
      type: UserType,
      resolve: (prediction, _, context) => {
        return UserLoader.load(context, prediction.creator);
      }
    },
    comment: {
      type: CommentType,
      resolve: (prediction, _, context) => {
        return CommentLoader.load(context, prediction.comment);
      }
    },
    blockTimestamp: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: prediction => prediction.blockTimestamp
    }
  }),
  interfaces: () => [nodeInterface]
});

export const PredictionConnection = connectionDefinitions({
  name: "Prediction",
  nodeType: PredictionType
});

registerTypeLoader(PredictionType, load);

export default PredictionType;
