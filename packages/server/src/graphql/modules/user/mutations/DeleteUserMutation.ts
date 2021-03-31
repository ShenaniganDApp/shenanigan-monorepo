import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';
import UserModel from '../UserModel';

export const DeleteUser = mutationWithClientMutationId({
	name: 'Delete',
	inputFields: {
		_id: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ _id }, { user }: GraphQLContext) => {
		if (!user) {
			return {
				error: 'User not logged in',
			};
		}
		const existingUser = UserModel.findOne({ _id });
		if (user._id !== existingUser._id) {
			return {
				error: 'Only the user can delete themselves',
			};
		}
		UserModel.deleteOne({ _id }, (err) => {
			if (err) {
				return {
					error: err.message,
				};
			}
		});
		return {
			message: `User with username: "${user.username}" was deleted`,
		};
	},
	outputFields: {
		message: {
			type: GraphQLString,
			resolve: ({ message }) => message,
		},
		...successField,
		...errorField,
	},
});
