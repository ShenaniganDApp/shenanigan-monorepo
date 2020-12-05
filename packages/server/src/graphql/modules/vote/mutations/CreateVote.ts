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
    blockNumber: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  mutateAndGetPayload: async (
    { choice, challengeId, blockNumber },
    { user }: GraphQLContext
  ) => {
    if (!user) throw new Error("Unauthenticated");
      
    
    try{
    const fetchedChallenge = await ChallengeModel.findById(challengeId);
    if (!fetchedChallenge) throw new Error("Challenge not found.");
      
    const voteExists = await VoteModel.findOne({challenge:challengeId, creator:user._id, challengeSeries:fetchedChallenge.series });
    if(voteExists) throw new Error("Vote already exists for this user");

    const voteEnd = fetchedChallenge.votePeriods[fetchedChallenge.series][1]
    if (blockNumber > voteEnd) throw new Error("Vote is already closed");
    
    const vote = new VoteModel({
      creator: user._id,
      choice,
      challenge: fetchedChallenge,
      challengeSeries: fetchedChallenge.series,
    });
    await vote.save();

    fetchedChallenge.votes.push(vote._id);
    user.votes.push(vote._id)
    await fetchedChallenge.save();
    await user.save();
    return vote;
  } catch(err) {
    throw new Error(err)
  } 

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
