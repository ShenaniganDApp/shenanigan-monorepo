import { FILTER_CONDITION_TYPE } from '@entria/graphql-mongo-helpers';
import { GraphQLID, GraphQLInputObjectType } from 'graphql';

import { getObjectId } from '../../utils';

export const userFilterMapping = {
	moderator: {
		type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
		format: (val: string) => ({ $in: [val] }),
	},
	moderatedUsers: {
		type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
		format: (val: string) => ({ $in: [val] }),
	},
};

const UserFilterInputType = new GraphQLInputObjectType({
	name: 'UserFilter',
	description: 'Used to filter user',
	fields: () => ({
		user: {
			type: GraphQLID,
		},
		moderator: {
			type: GraphQLID,
		},
	}),
});

export default UserFilterInputType;
