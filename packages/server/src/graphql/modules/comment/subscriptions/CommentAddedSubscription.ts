import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
import { CommentConnection } from '../CommentType';

import pubSub, { EVENTS } from '../../../pubSub';

const CommentAddedPayloadType = new GraphQLObjectType({
  name: 'CommentAddedPayload',
  fields: () => ({
    commentEdge: {
      type: CommentConnection.edgeType,
      resolve: ({ comment }) => ({
        cursor: offsetToCursor(comment.id),
        node: comment
      })
    }
  })
});

const commentAddedSubscription = {
  type: CommentAddedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.COMMENT.ADDED)
};

export default commentAddedSubscription;
