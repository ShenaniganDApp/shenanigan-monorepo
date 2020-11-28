import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { connectionArgs, fromGlobalId } from "graphql-relay";

import * as PredictionLoader from "../PredictionLoader";
import PredictionType, { PredictionConnection } from "../PredictionType";

export default {
  prediction: {
    type: PredictionType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (obj, args, context) => {
      const { id } = fromGlobalId(args.id);
      return PredictionLoader.load(context, id);
    }
  },
  predictions: {
    type: PredictionConnection.connectionType,
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString
      }
    },
    resolve: (obj, args, context) => {
      return PredictionLoader.loadAll(context, args);
    }
  }
};
