const User = require('../UserModel');
const { mutationWithClientMutationId } = require('graphql-relay');
const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');

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
      userId: user.id,
      message: `User with username: "${user.username}" was deleted`
    };
  },
  outputFields: {
    // id: {
    //   type: GraphQLID,
    //   resolve: ({ userId }) => userId
    // },
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
