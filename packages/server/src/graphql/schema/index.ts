import { GraphQLSchema } from "graphql";

import MutationType from "./type/MutationType";
import QueryType from "./type/QueryType";
import SubscriptionType from "./type/SubscriptionType";

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
});
