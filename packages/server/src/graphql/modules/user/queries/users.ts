import { GraphQLID, GraphQLNonNull } from 'graphql';
import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../../TypeDefinition';

import * as UserLoader from '../UserLoader';
import UserType, { UserConnection } from '../UserType';

export default {
	me: {
		type: UserType,
		resolve: (_1: unknown, _2: unknown, context: GraphQLContext): unknown => {
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
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext): unknown => {
			const { id } = fromGlobalId(args.id);
			return UserLoader.load(context, id);
		},
	},
	users: {
		type: UserConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext): unknown =>
			UserLoader.loadAll(context, args),
	},
};
