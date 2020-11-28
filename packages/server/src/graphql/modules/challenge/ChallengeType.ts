import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { globalIdField } from "graphql-relay";

import {
  CommentLoader,
  DonationLoader,
  PredictionLoader,
  UserLoader
} from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import {
  connectionArgs,
  connectionDefinitions,
  mongooseIDResolver,
  withFilter
} from "../../utils";
import { CommentConnection } from "../comment/CommentType";
import { DonationConnection } from "../donation/DonationType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import { PredictionConnection } from "../prediction/PredictionType";
import UserType from "../user/UserType";
import { load } from "./ChallengeLoader";
import { IChallenge } from "./ChallengeModel";

const ChallengeType = new GraphQLObjectType<IChallenge, GraphQLContext>({
  name: "Challenge",
  description: "Challenge data",
  fields: () => ({
    id: globalIdField("Challenge"),
    ...mongooseIDResolver,
    title: {
      type: GraphQLNonNull(GraphQLString),
      resolve: challenge => challenge.title
    },
    content: {
      type: GraphQLString,
      resolve: challenge => challenge.content
    },
    active: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: challenge => challenge.active
    },
    series: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: challenge => challenge.series
    },
    donations: {
      type: DonationConnection.connectionType,
      args: {
        ...connectionArgs
      },
      resolve: async (challenge, args, context) => {
        const donations = await DonationLoader.loadAll(
          context,
          withFilter(args, { challenge: challenge._id })
        );
        return donations;
      }
    },
    creator: {
      type: GraphQLNonNull(UserType),
      resolve: (challenge, _, context) => {
        return UserLoader.load(context, challenge.creator);
      }
    },
    options: {
      type: GraphQLNonNull(GraphQLList(GraphQLString)),
      resolve: challenge => challenge.options
    },
    predictions: {
      type: PredictionConnection.connectionType,
      args: {
        ...connectionArgs
      },
      resolve: async (challenge, args, context) => {
        const predictions = await PredictionLoader.loadAll(
          context,
          withFilter(args, { challenge: challenge._id })
        );
        return predictions;
      }
    },
    comments: {
      type: CommentConnection.connectionType,
      args: {
        ...connectionArgs
      },
      resolve: async (challenge, args, context) => {
        const comments = await CommentLoader.loadAll(
          context,
          withFilter(args, { challenge: challenge._id })
        );
        return comments;
      }
    }
  }),
  interfaces: () => [nodeInterface]
});

export { ChallengeType };

registerTypeLoader(ChallengeType, load);

export const ChallengeConnection = connectionDefinitions({
  name: "Challenge",
  nodeType: ChallengeType
});
