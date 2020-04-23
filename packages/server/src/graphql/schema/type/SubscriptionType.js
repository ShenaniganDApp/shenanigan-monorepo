const { GraphQLObjectType } = require('graphql');

// const WagerSubscriptions = require('../../poll/subscriptions');
const CommentSubscriptions = require('../../comment/subscriptions');

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    // ...WagerSubscriptions,
    ...CommentSubscriptions
  }
});

module.exports = SubscriptionType;
