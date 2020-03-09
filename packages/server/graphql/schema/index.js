const { GraphQLSchema } = require('graphql');

const QueryType = require('./type/QueryType');
const MutationType = require('./type/MutationType');
const SubscriptionType = require('./type/SubscriptionType');

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  // subscription: SubscriptionType
});

module.exports = schema;
