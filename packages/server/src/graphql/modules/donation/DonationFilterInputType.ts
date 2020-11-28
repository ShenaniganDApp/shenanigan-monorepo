import { FILTER_CONDITION_TYPE } from "@entria/graphql-mongo-helpers";
import { GraphQLID, GraphQLInputObjectType } from "graphql";

import { getObjectId } from "../../utils";

export const donationFilterMapping = {
  creator: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val)
  },
  challenge: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val)
  }
};

const DonationFilterInputType = new GraphQLInputObjectType({
  name: "DonationFilter",
  description: "Used to filter donations",
  fields: () => ({
    creator: {
      type: GraphQLID
    },
    challenge: {
      type: GraphQLID
    },
    donation: {
      type: GraphQLID
    }
  })
});

export default DonationFilterInputType;
