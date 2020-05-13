import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, WagerLoader } from '../../loaders';

import WagerType from '../wager/WagerType';
import UserType from '../user/UserType';

import { connectionDefinitions } from '../../customConnectionType';
import { registerType, nodeInterface } from '../../nodeInterface';

const DonationType = registerType(
  new GraphQLObjectType({
    name: 'Donation',
    description: 'Donation data',
    fields: () => ({
      id: globalIdField('Donation'),
      _id: {
        type: GraphQLID,
        resolve: (donation) => donation._id,
      },
      amount: {
        type: GraphQLNonNull(GraphQLFloat),
        resolve: (donation) => donation.amount,
      },
      creator: {
        type: UserType,
        resolve: (wager, args, context) => {
          return UserLoader.loadCreator(wager, context, args);
        },
      },
    }),
    interfaces: () => [nodeInterface],
  })
);

export const DonationConnection = connectionDefinitions({
  name: 'Donation',
  nodeType: DonationType,
});

export default DonationType;
