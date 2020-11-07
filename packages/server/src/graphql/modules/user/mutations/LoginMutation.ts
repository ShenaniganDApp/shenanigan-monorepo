import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import jwt from "jsonwebtoken";

import UserModel from "../UserModel";

export default mutationWithClientMutationId({
  name: "Login",
  inputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
    DID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ address, DID }) => {
    const user = await UserModel.findOne({ addresses: address });
    if (!user) {
      throw new Error("User does not exist");
    }

    const isEqual = user.authenticate(DID);

    if (!isEqual) {
      throw new Error(`DID is incorrect for user`);
    }
    const token = jwt.sign(
      {
        userId: user.id,
        address,
      },
      process.env.API_KEY as string
    );
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
