import { FILTER_CONDITION_TYPE } from "@entria/graphql-mongo-helpers";
import { GraphQLID, GraphQLInputObjectType } from "graphql";

import { getObjectId } from "../../utils";

export const challengeCardFilterMapping = {
  creator: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val)
  }
};

const ChallengeCardFilterInputType = new GraphQLInputObjectType({
  name: "ChallengeCardFilter",
  description: "Used to filter challenges",
  fields: () => ({
    creator: {
      type: GraphQLID
    },
    challenge: {
      type: GraphQLID
    }
  })
});

export default ChallengeCardFilterInputType;
