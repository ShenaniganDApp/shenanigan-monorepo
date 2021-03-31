import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserLoader } from '../../../loaders';
import { GraphQLContext } from '../../../TypeDefinition';
import { errorField } from '../../../utils/errorField';
import { successField } from '../../../utils/successField';
import UserModel from '../UserModel';
import UserType from '../UserType';

export const AddOrRemoveModerator = mutationWithClientMutationId({
	name: 'AddOrRemoveModerator',
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

		const mod = await UserModel.findOne({ _id });
		if (!mod) {
			return {
				error: 'User attempted to mod does not exist',
			};
		}
		const modIndex = user.moderatedUsers.indexOf(_id);
		if (modIndex === -1) {
			user.moderatedUsers.push(mod._id);
			mod.moderator.push(mod._id);
		} else {
			mod.moderator.splice(modIndex, 1);

			user.moderatedUsers.splice(modIndex, 1);
		}
		const userResult = await user.save();
		const modResult = await mod.save();
		return { userId: userResult._id, modId: modResult._id };
	},
	outputFields: {
		user: {
			type: UserType,
			resolve: async ({ userId }, _, context) => {
				const user = await UserLoader.load(context, userId);
				return user;
			},
		},
		moderator: {
			type: UserType,
			resolve: async ({ modId }, _, context) => {
				const user = await UserLoader.load(context, modId);
				return user;
			},
		},
		...successField,
		...errorField,
	},
});
