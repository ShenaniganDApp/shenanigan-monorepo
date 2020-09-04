import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, ChallengeLoader, CommentLoader } from '../../loaders';

import ChallengeType from '../challenge/ChallengeType';
import UserType from '../user/UserType';

import { GraphQLContext } from '../../TypeDefinition';
import { connectionDefinitions } from '../../utils';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import CommentType from '../comment/CommentType';

import { IDonation } from './DonationModel';
import { load } from './DonationLoader';

const DonationType = new GraphQLObjectType<IDonation, GraphQLContext>({
	name: 'Donation',
	description: 'Donation data',
	fields: () => ({
		id: globalIdField('Donation'),
		_id: {
			type: GraphQLNonNull(GraphQLID),
			resolve: (donation) => donation._id,
		},
		amount: {
			type: GraphQLNonNull(GraphQLFloat),
			resolve: (donation) => donation.amount,
		},
		creator: {
			type: GraphQLNonNull(UserType),
			resolve: (donation, _, context) => {
				return UserLoader.load(context, donation.creator);
			},
		},
		comment: {
			type: CommentType,
			resolve: (donation, _, context) => {
				return CommentLoader.load(context, donation.comment);
			},
		},
		challenge: {
			type: ChallengeType,
			resolve: (donation, _, context) => {
				return ChallengeLoader.load(context, donation.challenge);
			},
		},
		receiver: {
			type: UserType,
			resolve: (donation, _, context) => {
				return ChallengeLoader.load(context, donation.receiver);
			},
		},
	}),
	interfaces: () => [nodeInterface],
});

export const DonationConnection = connectionDefinitions({
	name: 'Donation',
	nodeType: DonationType,
});

registerTypeLoader(DonationType, load);

export default DonationType;
