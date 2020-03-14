const User = require('../../../models/user');
const { mutationWithClientMutationId } = require('graphql-relay');
const { GraphQLString, GraphQLNonNull } = require('graphql');

module.exports = mutationWithClientMutationId({
  name: 'Delete',
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ _id }) => {
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new Error('User does not exist');
    }
    User.deleteOne({ _id: _id }, err => {
      if (err) {
        throw new Error(err.message);
      }
    });
    return {
      message: `User with username: "${user.username}" was deleted`
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
