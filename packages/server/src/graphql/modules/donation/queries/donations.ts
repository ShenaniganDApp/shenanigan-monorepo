import { GraphQLID, GraphQLNonNull } from 'graphql';
import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../../TypeDefinition';

import * as DonationLoader from '../DonationLoader';
import { DonationType, DonationConnection } from '../DonationType';

type DonationById = {
	id: string;
};

export const DonationQueries = {
	donation: {
		type: DonationType,
		args: {
			id: {
				type: GraphQLNonNull(GraphQLID),
			},
		},
		resolve: (_1: unknown, args: DonationById, context: GraphQLContext): unknown => {
			const { id } = fromGlobalId(args.id);
			return DonationLoader.load(context, id);
		},
	},
	donations: {
		type: DonationConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext): unknown => {
			return DonationLoader.loadAll(context, args);
		},
	},
};
