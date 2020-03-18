import WagerModel from '../WagerModel';
import UserModel from '../../user/UserModel';

// import { pubSub, EVENTS } from ../../pubSub');

import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';

export default mutationWithClientMutationId({
  name: 'CreateWager',
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
  mutateAndGetPayload: async ({ title, content, options }, req) => {
    console.log(req.user)
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    if (options.length < 2) {
      throw new Error('WagerModel must have at least two options.');
    }
    const creatorId = req.user._id;
    const wager = new WagerModel({
      title,
      content,
      options,
      creator: creatorId,
      live: false
    });
    try {
      await wager.save();
      const creator = await UserModel.findById(creatorId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdWagers.push(wager._id);
      await creator.save();
      // await pubSub.publish(EVENTS.POLL.ADDED, { WagerAdded: { wager } });
      return wager;
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
