import { subscriptionWithClientId } from 'graphql-relay-subscription';

import { pubSub, EVENTS } from '../../../pubSub';
import { GraphQLContext } from '../../../TypeDefinition';
import * as CommentLoader from '../CommentLoader';
import { CommentType } from '../CommentType';

type CommentAdded = {
	commentId: string;
};

const CommentAddedSubscription = subscriptionWithClientId<CommentAdded, GraphQLContext>({
	name: 'CommentAdded',
	inputFields: {},
	outputFields: {
		comment: {
			type: CommentType,
			resolve: async ({ id }: any, _, context) => {
				const comment = await CommentLoader.load(context, id);
				return comment;
			},
		},
	},
	subscribe: (input, context) => {
		// eslint-disable-next-line
		console.log('Subscribe CommentAddedSubscription: ', input, context);

		return pubSub.asyncIterator(EVENTS.COMMENT.ADDED);
	},
	getPayload: async (obj: CommentAdded) => {
		return {
			id: obj.commentId,
		};
	},
});

export { CommentAddedSubscription as CommentAdded };
