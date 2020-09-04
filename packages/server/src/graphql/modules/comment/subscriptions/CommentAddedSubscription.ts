import CommentType from '../CommentType';
import { subscriptionWithClientId } from 'graphql-relay-subscription';

import pubSub, { EVENTS } from '../../../pubSub';
import * as CommentLoader from '../CommentLoader';
import { GraphQLNonNull } from 'graphql';

type CommentAdded = {
  _id: string;
};

const CommentAddedSubscription = new subscriptionWithClientId({
  name: 'CommentAdded',
  inputFields: {},
  outputFields: () => ({
    comment: {
      type: GraphQLNonNull(CommentType),
      resolve: async ({ _id }, _, context) =>
        await CommentLoader.load(context, _id),
    },
  }),
  subscribe: (input, context) => {
    // eslint-disable-next-line
    console.log('Subscribe CommentAddedSubscription: ', input, context);

    return pubSub.asyncIterator(EVENTS.COMMENT.ADDED);
  },
  getPayload: async (obj: CommentAdded) => {
    return {
      _id: obj._id,
    };
  },
});

export default CommentAddedSubscription;
