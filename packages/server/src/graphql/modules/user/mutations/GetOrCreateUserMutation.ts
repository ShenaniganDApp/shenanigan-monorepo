import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { UserLoader } from '../../../loaders';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';

import UserModel from '../UserModel';
import UserType from '../UserType';

export const GetOrCreateUser = mutationWithClientMutationId({
	name: 'GetOrCreateUser',
	inputFields: {
		username: {
			type: GraphQLString,
		},
		address: {
			type: new GraphQLNonNull(GraphQLString),
		},
		burner: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
	},
	mutateAndGetPayload: async ({ username, address, burner }) => {
		const ethRe = /^0x[a-fA-F0-9]{40}$/;
		const isAddress = address.match(ethRe);
		if (!isAddress) {
			throw new Error('Address given is not a valid Ethereum address');
		}
		const existingUser = await UserModel.findOne({
			addresses: address,
		});
		if (existingUser) {
			return { id: existingUser._id };
		}
		const addresses = [address];

		const user = new UserModel({
			username: username || address,
			addresses,
			burner,
		});
		await user.save();
		return {
			id: user._id,
		};
	},
	outputFields: {
		user: {
			type: UserType,
			resolve: async ({ user }, _, context) => {
				return await UserLoader.load(context, user);
			},
		},
		...errorField,
		...successField,
	},
});
