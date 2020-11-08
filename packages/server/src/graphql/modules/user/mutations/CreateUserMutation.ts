import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import jwt from 'jsonwebtoken';

import UserModel from '../UserModel';

export default mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
		username: {
			type: GraphQLString,
		},
		address: {
			type: new GraphQLNonNull(GraphQLString),
		},
		DID: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ username, address, DID }) => {
		const existingUser = await UserModel.findOne({
			addresses: address,
		});
		if (existingUser) {
			throw new Error('User already exists.');
		}
		// if (existingUser) {
		// existingUser.addresses.push(args.userInput.address);
		// const result = await existingUser.save();
		// return {
		//   ...result._doc,
		//   username: result._doc.username,
		//   addresses: result._doc.addresses,
		//   nonce: result._doc.nonce,
		//   _id: result.id
		// };
		// 	console.log(existingUser);
		// 	throw new Error('User already exists.');
		// }
		const addresses = [address];
		const user = new UserModel({
			username,
			addresses,
			DID,
		});
		const token = jwt.sign(
			{
				userId: user._id,
				addresses,
				DID,
			},
			process.env.API_KEY as string
		);
		await user.save();
		return {
			token,
		};
	},
	outputFields: {
		token: {
			type: GraphQLString,
			resolve: ({ token }) => token,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
