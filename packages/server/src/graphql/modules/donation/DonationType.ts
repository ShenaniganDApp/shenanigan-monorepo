import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { ChallengeLoader, CommentLoader, UserLoader } from '../../loaders';
import { GraphQLContext } from '../../TypeDefinition';
import { connectionDefinitions } from '../../utils';
import { ChallengeType } from '../challenge/ChallengeType';
import { CommentType } from '../comment/CommentType';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import UserType from '../user/UserType';
import { load } from './DonationLoader';
import { IDonation } from './DonationModel';

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
		challengeSeries: {
			type: GraphQLNonNull(GraphQLInt),
			resolve: (donation) => donation.challengeSeries,
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

export { DonationType };
