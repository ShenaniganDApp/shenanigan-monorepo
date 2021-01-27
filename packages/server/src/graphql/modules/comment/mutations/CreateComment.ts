import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { pubSub, EVENTS } from '../../../pubSub';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { ChallengeLoader, CommentLoader } from '../../../loaders';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { ChallengeType } from '../../challenge/ChallengeType';
import { CommentModel } from '../CommentModel';
import { CommentConnection } from '../CommentType';

type Args = {
	challengeId: string;
	content: string;
};

export const CreateComment = mutationWithClientMutationId({
	name: 'CreateComment',
	inputFields: {
		challengeId: {
			type: new GraphQLNonNull(GraphQLID),
		},
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ content, challengeId }: Args, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		const fetchedChallenge = await ChallengeModel.findById(challengeId);
		if (!fetchedChallenge) {
			throw new Error('Challenge not found.');
		}
		const comment = await new CommentModel({
			creator: user._id,
			content,
			challenge: fetchedChallenge,
			challengeSeries: fetchedChallenge.series,
		}).save();

		fetchedChallenge.comments.push(comment._id);
		await fetchedChallenge.save();
		await pubSub.publish(EVENTS.COMMENT.ADDED, { commentId: comment._id });

		return {
			id: comment._id,
			challenge: fetchedChallenge._id,
			error: null,
		};
	},
	outputFields: {
		commentEdge: {
			type: CommentConnection.edgeType,
			resolve: async ({ id }, _, context) => {
				// Load new edge from loader
				const comment = await CommentLoader.load(context, id);

				// Returns null if no node was loaded
				if (!comment) {
					return null;
				}

				return {
					cursor: toGlobalId('Comment', comment._id),
					node: comment,
				};
			},
		},
		challenge: {
			type: ChallengeType,
			resolve: async ({ challenge }, _, context) => {
				return await ChallengeLoader.load(context, challenge);
			},
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
