import DonationModel from '../DonationModel';
import ChallengeModel from '../../challenge/ChallengeModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel';

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import { GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';
export default mutationWithClientMutationId({
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
		const comment = null;
		const existingChallenge = await ChallengeModel.findOne({ _id: challenge });
		if (content && existingChallenge.live) {
			const comment = new CommentModel({
				id: globalIdField('Comment'),
				content,
				creator,
				challenge,
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
      amount,
      receiver
		};
	},
	outputFields: {
		amount: {
			type: GraphQLFloat,
			resolve: ({ amount }) => amount,
    },
    receiver: {
      type: GraphQLString,
			resolve: ({ reciever }) => reciever,
    },
		error: {
			type: GraphQLString,
			resolve: ({ error }) => error,
		},
	},
});
