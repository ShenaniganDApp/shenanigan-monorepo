import { GraphQLFloat, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';
import { ChallengeModel } from '../../challenge/ChallengeModel';
import { CommentModel } from '../../comment/CommentModel';
import { DonationModel } from '../DonationModel';

export const CreateDonation = mutationWithClientMutationId({
	name: 'CreateDonation',
	inputFields: {
		amount: {
			type: new GraphQLNonNull(GraphQLFloat),
		},
		content: {
			type: GraphQLString,
		},
		challenge: {
			type: new GraphQLNonNull(GraphQLString),
		},
		receiver: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},

	mutateAndGetPayload: async ({ amount, content, challenge, receiver }, { user }: GraphQLContext) => {
		if (!user) {
			throw new Error('Unauthenticated');
		}
		if (amount <= 0) {
			throw new Error('Not a valid donation amount');
		}
		const creator = user._id;
		let comment = null;
		const existingChallenge = await ChallengeModel.findOne({ _id: challenge });
		if (!existingChallenge) {
			throw new Error('Challenge does not exist');
		}
		if (content && existingChallenge.active) {
			comment = new CommentModel({
				id: globalIdField('Comment'),
				content,
				creator,
				challenge,
				challengeSeries: existingChallenge.series,
			});
			const createdComment = await comment.save();
			existingChallenge.comments.push(createdComment._id);
			await existingChallenge.save();
		}

		const donation = new DonationModel({
			id: globalIdField('Donation'),
			amount,
			creator,
			challenge,
			comment,
			receiver,
		});

		const createdDonation = await donation.save();
		existingChallenge.donations.push(createdDonation._id);
		existingChallenge.save();

		user.donations.push(donation._id);
		await user.save();
		return {
			createdDonation,
		};
	},
	outputFields: {
		amount: {
			type: GraphQLFloat,
			resolve: ({ amount }) => amount,
		},
		receiver: {
			type: GraphQLString,
			resolve: ({ receiver }) => receiver,
		},
		challengeSeries: {
			type: GraphQLString,
			resolve: ({ challengeSeries }) => challengeSeries,
		},
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
