import { GraphQLNonNull } from "graphql";
import { subscriptionWithClientId as SubscriptionWithClientId } from "graphql-relay-subscription";

import pubSub, { EVENTS } from "../../../pubSub";
import { GraphQLContext } from "../../../TypeDefinition";
import * as CommentLoader from "../CommentLoader";
import { CommentType } from "../CommentType";

type CommentAdded = {
  _id: string;
};

const CommentAddedSubscription = new SubscriptionWithClientId({
  name: "CommentAdded",
  inputFields: {},
  outputFields: () => ({
    comment: {
      type: GraphQLNonNull(CommentType),
      resolve: async (
        { _id }: CommentAdded,
        _: unknown,
        context: GraphQLContext
      ) => {
        const comment = await CommentLoader.load(context, _id);
        return comment;
      }
    }
  }),
  subscribe: (input: Record<string, never>, context: GraphQLContext) => {
    // eslint-disable-next-line
    console.log("Subscribe CommentAddedSubscription: ", input, context);

    return pubSub.asyncIterator(EVENTS.COMMENT.ADDED);
  },
  getPayload: async (obj: CommentAdded) => {
    return {
      _id: obj._id
    };
  }
});

export { CommentAddedSubscription as CommentAdded };
