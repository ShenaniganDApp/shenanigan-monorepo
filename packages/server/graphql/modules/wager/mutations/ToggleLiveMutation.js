const Wager = require('../WagerModel');

const { mutationWithClientMutationId } = require('graphql-relay');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

module.exports = mutationWithClientMutationId({
  name: 'ToggleLive',
  inputFields: {
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ wagerId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const wager = await Wager.findOne({ _id: wagerId });
    console.log(wager);
    if (wager.live) {
      wager.live = false;
      const result = await wager.save();
      return { live: result.live };
    }
    if (wager.options.length < 2) {
      throw new Error('Wager must have at least two options.');
    }
    wager.live = true;
    const result = await wager.save();
    return { live: result.live };
  },

  outputFields: {
    live: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: ({ live }) => live
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
