import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";

import { ChallengeLoader, UserLoader } from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionDefinitions, mongooseIDResolver } from "../../utils";
import { ChallengeType } from "../challenge/ChallengeType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import UserType from "../user/UserType";
import { load } from "./ChallengeCardLoader";
import { IChallengeCard } from "./ChallengeCardModel";

const ChallengeCardType = new GraphQLObjectType<IChallengeCard, GraphQLContext>(
  {
    name: "ChallengeCard",
    description: "ChallengeCard data",
    fields: () => ({
      id: globalIdField("ChallengeCard"),
      ...mongooseIDResolver,
      title: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challengeCard) => challengeCard.title,
      },
      content: {
        type: GraphQLString,
        resolve: (challengeCard) => challengeCard.content,
      },
      address: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challengeCard) => challengeCard.address,
      },
      ipfs: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challengeCard) => challengeCard.ipfs,
      },
      streamUrl: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challengeCard) => challengeCard.streamUrl,
      },
      price: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (challengeCard) => challengeCard.price,
      },
      result: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (challengeCard) => challengeCard.result,
      },
      resultType: {
        type: GraphQLBoolean,
        resolve: (challengeCard) => challengeCard.resultType,
      },
      totalMint: {
        type: GraphQLNonNull(GraphQLInt),
        resolve: (challengeCard) => challengeCard.totalMint,
      },
      creator: {
        type: GraphQLNonNull(UserType),
        resolve: (challengeCard, _, context) => {
          return UserLoader.load(context, challengeCard.creator);
        },
      },
      challenge: {
        type: GraphQLNonNull(ChallengeType),
        resolve: (challengeCard, _, context) => {
          return ChallengeLoader.load(context, challengeCard.challenge);
        },
      },
      createdAt: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (challengeCard) => challengeCard.createdAt,
      },
    }),
    interfaces: () => [nodeInterface],
  }
);

export { ChallengeCardType };

registerTypeLoader(ChallengeCardType, load);

export const ChallengeCardConnection = connectionDefinitions({
  name: "ChallengeCard",
  nodeType: ChallengeCardType,
});
