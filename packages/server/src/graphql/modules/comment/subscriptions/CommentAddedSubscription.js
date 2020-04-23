const { GraphQLObjectType } = require('graphql');
const { offsetToCursor } = require('graphql-relay');

const { pubSub, EVENTS } = require('../../pubSub');

const CommentAddedPayloadType = new GraphQLObjectType({
  name: 'CommentAddedPayload',
  fields: () => ({
    commentEdge: {
      type: require('../commentType').CommentConnection.edgeType,
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

module.exports = commentAddedSubscription;
