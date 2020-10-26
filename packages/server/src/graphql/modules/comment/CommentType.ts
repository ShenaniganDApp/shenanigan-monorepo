import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";

import { ChallengeLoader, UserLoader } from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionDefinitions } from "../../utils";
import ChallengeType from "../challenge/ChallengeType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import UserType from "../user/UserType";
import { load } from "./CommentLoader";
import { IComment } from "./CommentModel";

const CommentType = new GraphQLObjectType<IComment, GraphQLContext>({
  name: "Comment",
  description: "Comment data",
  fields: () => ({
    id: globalIdField("Comment"),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: (comment) => comment._id,
    },
    challenge: {
      type: ChallengeType,
      resolve: (comment, _, context) =>
        ChallengeLoader.load(context, comment.challenge),
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (comment) => comment.content,
    },
    creator: {
      type: GraphQLNonNull(UserType),
      resolve: (comment, _, context) =>
        UserLoader.load(context, comment.creator),
    },
  }),
  interfaces: () => [nodeInterface],
});

export default CommentType;

registerTypeLoader(CommentType, load);

export const CommentConnection = connectionDefinitions({
  name: "Comment",
  nodeType: CommentType,
});
