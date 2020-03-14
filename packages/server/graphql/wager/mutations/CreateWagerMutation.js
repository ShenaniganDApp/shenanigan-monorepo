const Wager = require('../../../models/wager');
const User = require('../../../models/user');

const { transformWager } = require('../../merge');
// const { pubSub, EVENTS } = require('../../pubSub');

const { mutationWithClientMutationId } = require('graphql-relay');
const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} = require('graphql');

module.exports = mutationWithClientMutationId({
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
    console.log(Object.keys(req))
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    if (options.length < 2) {
      throw new Error('Wager must have at least two options.');
    }
    const creatorId = req.user._id;
    const wager = new Wager({
      title,
      content,
      options,
      creator: creatorId,
      live: true
    });
    let createdWager;
    try {
      const result = await wager.save();
      createdWager = transformWager(result);
      const creator = await User.findById(creatorId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdWagers.push(wager);
      await creator.save();
      // await pubSub.publish(EVENTS.POLL.ADDED, { WagerAdded: { wager } });
      return createdWager;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLID),
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
