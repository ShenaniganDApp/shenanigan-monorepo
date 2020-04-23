import CommentModel from '../CommentModel';
import WagerModel from '../../wager/WagerModel';

// import { transformComment } from '../../merge');
// import { pubSub, COMMENTS } from '../../pubSub');

import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} from 'graphql';

export default mutationWithClientMutationId({
  name: 'CreateComment',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ content, wagerId }, req) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated');
    // }
    const fetchedWager = await WagerModel.findById(wagerId);
    if (!fetchedWager) {
      throw new Error('Wager not found.');
    }
    const comment = new CommentModel({
      creator: req.user._id,
      content: content,
      wager: fetchedWager
    });
    await comment.save();
   
    fetchedWager.comments.push(comment._id);
    await fetchedWager.save();
    console.log(fetchedWager)
    return comment
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: ({ _id }) => _id
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ content }) => content
    },
    creator: {
      type: GraphQLNonNull(GraphQLID),
      resolve: ({ creator }) => creator
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
