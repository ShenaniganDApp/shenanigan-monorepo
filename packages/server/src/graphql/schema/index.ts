import { GraphQLSchema } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';

import { MutationType } from './type/MutationType';
import { QueryType } from './type/QueryType';
import { SubscriptionType } from './type/SubscriptionType';

import { remoteSchema } from '../../graphql/remote-schemas/schema';

const localSchema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType,
	subscription: SubscriptionType,
});

export const schema = stitchSchemas({
	subschemas: [
		{
			schema: localSchema,
		},
		{
			schema: remoteSchema,
		},
	],
});
