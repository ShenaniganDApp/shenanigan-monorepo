import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../../TypeDefinition';

import * as CommentLoader from '../CommentLoader';
import { CommentType, CommentConnection } from '../CommentType';

type CommentById = {
	id: string;
};

export const CommentQueries = {
	comment: {
		type: CommentType,
		args: {
			id: {
				type: GraphQLNonNull(GraphQLID),
			},
		},
		resolve: (_1: unknown, args: CommentById, context: GraphQLContext): unknown => {
			const { id } = fromGlobalId(args.id);
			return CommentLoader.load(context, id);
		},
	},
	comments: {
		type: CommentConnection.connectionType,
		args: {
			...connectionArgs,
			search: {
				type: GraphQLString,
			},
		},
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext): unknown => {
			return CommentLoader.loadAll(context, args);
		},
	},
};
