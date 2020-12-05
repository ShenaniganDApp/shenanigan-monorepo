import { FILTER_CONDITION_TYPE } from "@entria/graphql-mongo-helpers";
import { GraphQLID, GraphQLInputObjectType } from "graphql";
import { Types } from "mongoose";

import { getObjectId } from "../../utils";

export const voteFilterMapping = {
  creator: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string): Types.ObjectId | string | null =>
      val && getObjectId(val),
  },
  challenge: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string): Types.ObjectId | string | null =>
      val && getObjectId(val),
  },
};

const VoteFilterInputType = new GraphQLInputObjectType({
  name: "VoteFilter",
  description: "Used to filter votes",
  fields: () => ({
    creator: {
      type: GraphQLID,
    },
    challenge: {
      type: GraphQLID,
    },
    donation: {
      type: GraphQLID,
    },
  }),
});

export { VoteFilterInputType };
