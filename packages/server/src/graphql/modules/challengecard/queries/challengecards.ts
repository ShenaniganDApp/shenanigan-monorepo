import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay';
import { GraphQLContext } from '../../../TypeDefinition';

import * as ChallengeCardLoader from '../ChallengeCardLoader';
import ChallengeCardType, { ChallengeCardConnection } from '../ChallengeCardType';

type ChallengeCardById = {
	id: string;
};

export const ChallengeCardQueries = {
	challengeCard: {
		type: ChallengeCardType,
		args: {
			id: {
				type: GraphQLNonNull(GraphQLID),
			},
		},
		resolve: (_1: unknown, args: ChallengeCardById, context: GraphQLContext) => {
			const { id } = fromGlobalId(args.id);
			return ChallengeCardLoader.load(context, id);
		},
	},
	challengeCards: {
		type: ChallengeCardConnection.connectionType,
		args: {
			...connectionArgs,
			search: {
				type: GraphQLString,
			},
		},
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext) => {
			return ChallengeCardLoader.loadAll(context, args);
		},
	},
};
