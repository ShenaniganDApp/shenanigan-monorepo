import bcrypt from "bcryptjs";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import jwt from "jsonwebtoken";

import UserModel from "../UserModel";

export default mutationWithClientMutationId({
  name: "CreateUser",
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
      email,
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
      throw new Error("User already exists.");
    }

    const user = new UserModel({
      username,
      email,
      password,
    });
    const token = jwt.sign(
      {
        userId: user._id,
        username,
        email,
      },
      "somesupersecretkey"
    );
    await user.save();
    return {
      token,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
