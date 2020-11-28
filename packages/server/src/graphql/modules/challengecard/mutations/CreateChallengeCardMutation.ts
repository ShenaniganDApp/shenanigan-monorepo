// import { pubSub, EVENTS } from ../../pubSub');
import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { ChallengeModel } from "../../challenge/ChallengeModel";
import ChallengeCardModel from "../ChallengeCardModel";

export const CreateChallengeCard = mutationWithClientMutationId({
  name: "CreateChallengeCard",
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    content: {
      type: GraphQLString
    },
    address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    ipfs: {
      type: new GraphQLNonNull(GraphQLString)
    },
    streamUrl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    result: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    totalMint: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async (
    {
      title,
      content,
      address,
      ipfs,
      streamUrl,
      price,
      result,
      totalMint,
      challengeId
    },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    if (totalMint < 1) {
      throw new Error("Attempted to mint 0 cards");
    }

    if (price <= 0) {
      throw new Error("Cannot set a price at 0 ");
    }
    const creator = user._id;
    const challenge = await ChallengeModel.findOne({ _id: challengeId });
    if (!challenge) {
      throw new Error("Challenge does not exist");
    }
    const challengeCard = new ChallengeCardModel({
      title,
      content,
      address,
      ipfs,
      streamUrl,
      price,
      result,
      totalMint,
      creator,
      challenge: challengeId
    });
    try {
      await challengeCard.save();
      user.challengeCards.push(challengeCard._id);
      challenge.challengeCards.push(challengeCard._id);
      // await pubSub.publish(EVENTS.POLL.ADDED, { ChallengeAdded: { challenge } });
      return challengeCard;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ _id }) => _id
    },
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title
    },
    content: {
      type: GraphQLString,
      resolve: ({ content }) => content
    },
    ipfs: {
      type: GraphQLList(GraphQLString),
      resolve: ({ ipfs }) => ipfs
    },
    streamUrl: {
      type: GraphQLList(GraphQLString),
      resolve: ({ streamUrl }) => streamUrl
    },
    result: {
      type: GraphQLList(GraphQLInt),
      resolve: ({ result }) => result
    },
    price: {
      type: GraphQLList(GraphQLFloat),
      resolve: ({ price }) => price
    },
    totalMint: {
      type: GraphQLList(GraphQLInt),
      resolve: ({ totalMint }) => totalMint
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
