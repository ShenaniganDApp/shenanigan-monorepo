const User = require('../../../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mutationWithClientMutationId } = require('graphql-relay');
const { GraphQLString, GraphQLNonNull } = require('graphql');

module.exports = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error(`Password is incorrect`);
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      'somesupersecretkey'
    );
    return {
      token: token
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
