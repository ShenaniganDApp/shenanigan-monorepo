import User from '../UserModel';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../UserType';

import * as UserLoader from '../UserLoader';

export default {
	me: {
		type: UserType,
		resolve: (root, args, context) => {
			return context.user ? UserLoader.load(context, context.user._id) : null;
		},
	},
	user: {
		type: UserType,
		args: {
			id: {
				type: GraphQLNonNull(GraphQLID),
			},
		},
		resolve: (obj, args, context) => {
			const { id } = fromGlobalId(args.id);
			return UserLoader.load(context, id);
		},
	},
	users: {
		type: UserConnection.connectionType,
		args: {
			...connectionArgs,
			search: {
				type: GraphQLString,
			},
		},
		resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
	},
};
