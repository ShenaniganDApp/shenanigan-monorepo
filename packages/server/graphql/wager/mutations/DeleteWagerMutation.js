const Wager = require('../../../models/wager');

const {
  mutationWithClientMutationId,
  globalIdField
} = require('graphql-relay');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

module.exports = mutationWithClientMutationId({
  name: 'DeleteWager',
  inputFields: {
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    creator: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ wagerId, creator }, req) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated');
    // }
    const wager = await Wager.findOne({ _id: wagerId });
    const creatorId = wager.creator._id.toString();
    if ( creatorId !== creator) {
      throw new Error('User is not creator');
    }
    await Wager.deleteOne({ _id: wagerId });
    console.log('deleted wager with title: ' + wager.title);
  },

  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
