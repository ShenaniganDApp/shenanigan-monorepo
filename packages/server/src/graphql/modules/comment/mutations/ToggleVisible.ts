import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { CommentType } from '../CommentType';
import UserModel from '../../user/UserModel';
import { CommentModel } from '../CommentModel';
import { CommentLoader } from '../../../loaders';
import { successField } from '../../../utils/successField';
import { errorField } from '../../../utils/errorField';

type Args = {
	_id: string;
};

export const ToggleVisible = mutationWithClientMutationId({
	name: 'ToggleVisible',
	inputFields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	mutateAndGetPayload: async ({ _id }: Args, { user }: GraphQLContext) => {
		if (!user) {
			return {
				error: 'User not logged in',
			};
		}
		const comment = await CommentModel.findById(_id);
		if (!comment) {
			return {
				error: 'Comment not found.',
			};
		}
		const creator = await UserModel.findById(comment.creator);
		if (!creator) {
			return {
				error: 'Comment creator could not be found',
			};
		}
		if (creator._id !== user._id || creator.moderatedUsers.indexOf(user._id) === -1) {
			return {
				error: 'Only the creator or moderators can toggle visibility',
			};
		}
		comment.visible = !comment.visible;
		const result = await comment.save();
		return {
			id: result._id,
			error: null,
		};
	},
	outputFields: {
		comment: {
			type: CommentType,
			resolve: async ({ id }, _, context) => {
				const comment = await CommentLoader.load(context, id);
				return comment;
			},
		},
		...successField,
		...errorField,
	},
});
