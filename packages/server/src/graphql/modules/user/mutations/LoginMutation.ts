import UserModel from '../UserModel';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';

export default mutationWithClientMutationId({
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
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error('UserModel does not exist');
    }

    const isEqual = user.authenticate(password);
   
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
