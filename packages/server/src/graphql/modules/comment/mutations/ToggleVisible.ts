import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../TypeDefinition";
import { CommentType } from "../CommentType";
import UserModel from "../../user/UserModel";
import { CommentModel } from "../CommentModel";
import { CommentLoader } from "../../../loaders";

type Args = {
  _id: string;
};

export const ToggleVisible = mutationWithClientMutationId({
  name: "ToggleVisible",
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ _id }: Args, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error("Unauthenticated");
    }
    try {
      const comment = await CommentModel.findById(_id);
      if (!comment) {
        throw new Error("Comment not found.");
      }
      const creator = await UserModel.findById(comment.creator);
      if (!creator) {
        throw new Error("Comment creator could not be found");
      }
      if (
        creator._id !== user._id ||
        creator.moderatedUsers.indexOf(user._id) === -1
      ) {
        throw new Error("Only the creator or moderators can toggle visibility");
      }
      comment.visible = !comment.visible;
      const result = await comment.save();
      return {
        id: result._id,
        error: null,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  outputFields: {
    comment: {
      type: CommentType,
      resolve: async ({ id }, _, context) => {
        const comment = await CommentLoader.load(context, id);
        return comment;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
