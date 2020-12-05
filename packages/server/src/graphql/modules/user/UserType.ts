import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { globalIdField } from "graphql-relay";

import {
  ChallengeLoader,
  DonationLoader,
  PredictionLoader,
  VoteLoader
} from "../../loaders";
import { GraphQLContext } from "../../TypeDefinition";
import { connectionArgs, connectionDefinitions, withFilter } from "../../utils";
import { ChallengeConnection } from "../challenge/ChallengeType";
import { DonationConnection } from "../donation/DonationType";
import { nodeInterface, registerTypeLoader } from "../node/typeRegister";
import { PredictionConnection } from "../prediction/PredictionType";
import { VoteConnection } from "../vote/VoteType";
import { load } from "./UserLoader";
import { IUser } from "./UserModel";

const UserType = new GraphQLObjectType<IUser, GraphQLContext>({
  name: "User",
  description: "User data",
  fields: () => ({
    id: globalIdField("User"),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: user => user._id
    },
    username: {
      type: GraphQLString,
      resolve: user => user.username
    },
    addresses: {
      type: GraphQLNonNull(GraphQLList(GraphQLString)),
      resolve: user => user.addresses
    },
    burner: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: user => user.burner
    },
    predictions: {
      type: GraphQLNonNull(PredictionConnection.connectionType),
      args: {
        ...connectionArgs
      },
      resolve: async (user, args, context) => {
        const predictions = await PredictionLoader.loadAll(
          context,
          withFilter(args, {
            creator: user._id
          })
        );
        return predictions;
      }
    },
    donations: {
      type: GraphQLNonNull(DonationConnection.connectionType),
      args: {
        ...connectionArgs
      },
      resolve: async (user, args, context) => {
        const donations = await DonationLoader.loadAll(
          context,
          withFilter(args, {
            creator: user._id
          })
        );
        return donations;
      }
    },
    createdChallenges: {
      type: GraphQLNonNull(ChallengeConnection.connectionType),
      args: {
        ...connectionArgs
      },
      resolve: async (user, args, context) => {
        const createdChallenges = await ChallengeLoader.loadAll(
          context,
          withFilter(
            { args },
            {
              creator: user._id
            }
          )
        );
        return createdChallenges;
      }
    },
    votes: {
      type: VoteConnection.connectionType,
      args: {
        ...connectionArgs
      },
      resolve: async (challenge, args, context) => {
        const votes = await VoteLoader.loadAll(
          context,
          withFilter(args, { challenge: challenge._id })
        );
        return votes;
      }
    }
  }),
  interfaces: () => [nodeInterface]
});

export const UserConnection = connectionDefinitions({
  name: "User",
  nodeType: UserType
});

registerTypeLoader(UserType, load);

export default UserType;
