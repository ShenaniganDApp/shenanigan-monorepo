import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
// import { transformComment } from '../../merge');
// import { pubSub, COMMENTS } from '../../pubSub');
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import ChallengeModel from "../../challenge/ChallengeModel";
import CommentModel from "../CommentModel";

export default mutationWithClientMutationId({
  name: "CreateComment",
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    challengeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { content, challengeId },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    const fetchedChallenge = await ChallengeModel.findById(challengeId);
    if (!fetchedChallenge) {
      throw new Error("Challenge not found.");
    }
    const comment = new CommentModel({
      creator: user._id,
      content,
      challenge: fetchedChallenge,
    });
    await comment.save();

    fetchedChallenge.comments.push(comment._id);
    await fetchedChallenge.save();
    console.log(fetchedChallenge);
    return comment;
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: ({ _id }) => _id,
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ content }) => content,
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
