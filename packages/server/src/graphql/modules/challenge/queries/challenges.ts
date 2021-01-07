import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, ConnectionArguments, fromGlobalId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import * as ChallengeLoader from '../ChallengeLoader';
import { ChallengeModel } from '../ChallengeModel';
import { ChallengeConnection, ChallengeType } from '../ChallengeType';

type ChallengeById = {
	id: string;
};

export const ChallengeQueries = {
	liveChallenge: {
		type: ChallengeType,
		resolve: async (_1: unknown, _2: unknown, context: GraphQLContext): unknown => {
			const challenge = await ChallengeModel.findOne({ live: true });
			return challenge ? ChallengeLoader.load(context, challenge.id) : null;
			//@TODO handle error
		},
	},
	challenge: {
		type: ChallengeType,
		args: {
			id: {
				type: GraphQLNonNull(GraphQLID),
			},
		},
		resolve: (_1: unknown, args: ChallengeById, context: GraphQLContext): unknown => {
			const { id } = fromGlobalId(args.id);
			return ChallengeLoader.load(context, id);
		},
	},
	challenges: {
		type: ChallengeConnection.connectionType,
		args: {
			...connectionArgs,
			search: {
				type: GraphQLString,
			},
		},
		resolve: (_1: unknown, args: ConnectionArguments, context: GraphQLContext): unknown => {
			return ChallengeLoader.loadAll(context, args);
		},
	},
};
