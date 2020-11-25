import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

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
	},
	mutateAndGetPayload: async ({ username, address }) => {
		const ethRe = /^0x[a-fA-F0-9]{40}$/;
		const isAddress = address.match(ethRe);
		if (!isAddress) {
			throw new Error('Address given is not a valid Ethereum address');
		}
		const existingUser = await UserModel.findOne({
			addresses: address,
		});
		if (existingUser) {
			const existingAddress = existingUser.addresses.find((a) => a === address);
			console.log(`Fetched user with address ${existingAddress}`);
			return { user: existingUser };
		}
		const addresses = [address];

		const user = new UserModel({
			username: username ? username : address,
			addresses,
		});
		await user.save();
		console.log(`Created user with address ${address}`);
		return {
			user,
		};
	},
	outputFields: {
		user: {
			type: UserType,
			resolve: ({ user }) => user,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
