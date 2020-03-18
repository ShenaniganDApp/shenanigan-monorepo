import UserModel from '../UserModel';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';

export default mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ username, email, password }) => {
    // const existingAddress = await UserModel.findOne({
    //   addresses: args.userInput.address
    // });
    // if (existingAddress) {
    //   console.log(existingAddress);
    //   throw new Error('UserModel already exists.');
    // }
    const existingUser = await UserModel.findOne({
      email: email
    });
    if (existingUser) {
      // existingUser.addresses.push(args.userInput.address);
      // const result = await existingUser.save();
      // return {
      //   ...result._doc,
      //   username: result._doc.username,
      //   addresses: result._doc.addresses,
      //   nonce: result._doc.nonce,
      //   _id: result.id
      // };
      console.log(existingUser);
      throw new Error('UserModel already exists.');
    }
    // const nonce = await bcrypt.hash(args.userInput.address, 12);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel({
      username: username,
      email: email,
      password: hashedPassword
      // addresses: args.userInput.address,
      // nonce: nonce
    });
    const token = jwt.sign(
      {
        userId: user._id,
        username: username,
        email: email
      },
      'somesupersecretkey'
    );
    await user.save();
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
