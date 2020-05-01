import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { globalIdField, connectionArgs } from 'graphql-relay';

import { WagerLoader, BetLoader } from '../../loaders';
import { WagerConnection } from '../wager/WagerType';
import { BetConnection } from '../bet/BetType';

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
        resolve: (user) => user._id,
      },
      username: {
        type: GraphQLString,
        resolve: (user) => user.username,
      },
      email: {
        type: GraphQLString,
        resolve: (user) => user.email,
      },
      password: {
        type: GraphQLString,
        resolve: (user) => user.password,
      },
      bets: {
        type: BetConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          BetLoader.loadUserBets(user, context, args),
      },
      createdWagers: {
        type: WagerConnection.connectionType,
        args: { ...connectionArgs },
        resolve: (user, args, context) =>
          WagerLoader.loadUserWagers(user, context, args),
      },
    }),
    interfaces: () => [nodeInterface],
  })
);
export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

export default UserType;
