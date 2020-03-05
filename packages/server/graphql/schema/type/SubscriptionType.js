const { GraphQLObjectType } = require('graphql');

// const PollSubscriptions = require('../../poll/subscriptions');
// const CommentSubscriptions = require('../../comment/subscriptions');

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    // ...PollSubscriptions,
    // ...CommentSubscriptions
  }
});

module.exports = SubscriptionType;
