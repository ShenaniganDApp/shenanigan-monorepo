import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import { globalIdField, connectionArgs } from 'graphql-relay';

// import Bet from '../../models/bet');
import { WagerLoader } from '../../loaders';
import { WagerConnection } from '../wager/WagerType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    description: 'User data',
    fields: () => ({
      id: globalIdField('User'),
      _id: {
        type: GraphQLID,
        resolve: user => user._id
      },
      username: {
        type: GraphQLString,
        resolve: user => user.username
      },
      email: {
        type: GraphQLString,
        resolve: user => user.email
      },
      password: {
        type: GraphQLString,
        resolve: user => user.password
      },
      //   bets:{
      //     type: require('../bet/betType').BetConnection.connectionType,
      //     args: { ...connectionArgs },
      //     resolve: async (user, args) => {
      //       const bets = await Bet.find({ creator: user._id });
      //       bets.map(bet => {
      //         return transformBet(bet);
      //       });
      //       result = connectionFromArray(bets, args);
      //       result.totalCount = bets.length;
      //       result.count = result.edges.length;
      //       return result;
      //     }
      //   },
      createdWagers: {
        type: WagerConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          WagerLoader.loadUserWagers(user, context, args)
      }
    }),
    interfaces: () => [nodeInterface]
  })
);
export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType
});

export default UserType;
