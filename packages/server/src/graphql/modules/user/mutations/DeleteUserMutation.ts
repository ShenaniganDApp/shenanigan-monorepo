import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import UserModel from "../UserModel";

export const DeleteUser = mutationWithClientMutationId({
  name: "Delete",
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ _id }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error("Deleting requires authentication");
    }
    if (!user) {
      throw new Error("User does not exist");
    }
    UserModel.deleteOne({ _id }, err => {
      if (err) {
        throw new Error(err.message);
      }
    });
    return {
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
