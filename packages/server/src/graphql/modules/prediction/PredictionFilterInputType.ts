import { FILTER_CONDITION_TYPE } from "@entria/graphql-mongo-helpers";
import { GraphQLID, GraphQLInputObjectType } from "graphql";

import { getObjectId } from "../../utils";

export const predictionFilterMapping = {
  creator: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val)
  },
  challenge: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val)
  }
};

const PredictionFilterInputType = new GraphQLInputObjectType({
  name: "PredictionFilter",
  description: "Used to filter predictions",
  fields: () => ({
    creator: {
      type: GraphQLID
    },
    challenge: {
      type: GraphQLID
    },
    prediction: {
      type: GraphQLID
    }
  })
});

export default PredictionFilterInputType;
