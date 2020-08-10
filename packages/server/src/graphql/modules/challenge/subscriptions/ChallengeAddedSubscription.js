const { GraphQLObjectType } = require('graphql');
const { offsetToCursor } = require('graphql-relay');

// const { pubSub, EVENTS } = require('../../pubSub');

const ChallengeAddedPayloadType = new GraphQLObjectType({
  name: 'ChallengeAddedPayload',
  fields: () => ({
    challengeEdge: {
      type: require('../ChallengeType').ChallengeConnection.edgeType,
      resolve: ({ challenge }) => ({
        cursor: offsetToCursor(challenge.id),
        node: challenge
      })
    }
  })
});

const challengeAddedSubscription = {
  type: ChallengeAddedPayloadType,
  // subscribe: () => pubSub.asyncIterator(EVENTS.POLL.ADDED)
};

module.exports = challengeAddedSubscription;
