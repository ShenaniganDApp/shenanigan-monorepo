import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
// import { transformVote } from '../../merge');
// import { pubSub, COMMENTS } from '../../pubSub');
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { ChallengeModel } from "../../challenge/ChallengeModel";
import { VoteModel } from "../VoteModel";

export const CreateVote = mutationWithClientMutationId({
  name: "CreateVote",
  inputFields: {
    choice: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { choice, challengeId },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    const fetchedChallenge = await ChallengeModel.findById(challengeId);
    if (!fetchedChallenge) {
      throw new Error("Challenge not found.");
    }
    const vote = new VoteModel({
      creator: user._id,
      choice,
      challenge: fetchedChallenge,
      challengeSeries: fetchedChallenge.series,
    });
    await vote.save();

    // fetchedChallenge.votes.push(vote._id);
    await fetchedChallenge.save();
    return vote;
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: ({ _id }) => _id,
    },
    challengeSeries: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ challengeSeries }) => challengeSeries,
    },
    choice: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ choice }) => choice,
    },
    creator: {
      type: GraphQLNonNull(GraphQLID),
      resolve: ({ creator }) => creator,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
