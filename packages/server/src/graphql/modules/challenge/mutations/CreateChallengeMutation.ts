// import { pubSub, EVENTS } from ../../pubSub');
import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { ChallengeModel } from "../ChallengeModel";

export const CreateChallenge = mutationWithClientMutationId({
  name: "CreateChallenge",
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
    options: {
      type: new GraphQLNonNull(GraphQLList(GraphQLString))
    }
  },
  mutateAndGetPayload: async (
    { title, content, options },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    if (options.length < 2) {
      throw new Error("Challenge must have at least two options.");
    }
    const creator = user._id;

    const existingChallenge = await ChallengeModel.findOne({
      creator,
      live: true
    });
    if (existingChallenge) {
      throw new Error("User already has open challenge");
    }

    const challenge = new ChallengeModel({
      title,
      content,
      options,
      creator
    });
    try {
      await challenge.save();
      user.createdChallenges.push(challenge._id);
      // await pubSub.publish(EVENTS.POLL.ADDED, { ChallengeAdded: { challenge } });
      return challenge;
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
    options: {
      type: GraphQLList(GraphQLString),
      resolve: ({ options }) => options
    },

    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
