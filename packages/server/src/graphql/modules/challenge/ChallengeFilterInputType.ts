import { FILTER_CONDITION_TYPE } from '@entria/graphql-mongo-helpers';
import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType } from 'graphql';

import { getObjectId } from '../../utils';

export const challengeFilterMapping = {
	creator: {
		type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
		format: (val: string) => val && getObjectId(val),
	},
	active: {
		type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
		format: (val: string) => val,
	},
};

const ChallengeFilterInputType = new GraphQLInputObjectType({
	name: 'ChallengeFilter',
	description: 'Used to filter challenges',
	fields: () => ({
		creator: {
			type: GraphQLID,
		},
		active: {
			type: GraphQLBoolean,
		},
		challenge: {
			type: GraphQLID,
		},
	}),
});

export default ChallengeFilterInputType;
