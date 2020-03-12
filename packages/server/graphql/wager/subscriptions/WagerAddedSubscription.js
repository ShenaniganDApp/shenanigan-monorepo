const { GraphQLObjectType } = require('graphql');
const { offsetToCursor } = require('graphql-relay');

// const { pubSub, EVENTS } = require('../../pubSub');

const WagerAddedPayloadType = new GraphQLObjectType({
  name: 'WagerAddedPayload',
  fields: () => ({
    wagerEdge: {
      type: require('../WagerType').WagerConnection.edgeType,
      resolve: ({ wager }) => ({
        cursor: offsetToCursor(wager.id),
        node: wager
      })
    }
  })
});

const wagerAddedSubscription = {
  type: WagerAddedPayloadType,
  // subscribe: () => pubSub.asyncIterator(EVENTS.POLL.ADDED)
};

module.exports = wagerAddedSubscription;
