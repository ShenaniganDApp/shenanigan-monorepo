import DonationModel from '../DonationModel';
import WagerModel from '../../wager/WagerModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel';

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';

export default mutationWithClientMutationId({
  name: 'CreateBDonation',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    content: {
      type: GraphQLString,
    },
    wagerId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async ({ amount, content, wagerId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    if (amount <= 0) {
      throw new Error('Not a valid donation amount');
    }
    const creator = req.user;
    const existingWager = await WagerModel.findOne({ _id: wagerId });
    const comment = new CommentModel({
      id: globalIdField('Comment'),
      content,
      creator,
      wager: wagerId,
    });
    const createdComment = await comment.save();
    existingWager.comments.push(createdComment._id);
    const donation = new DonationModel({
      id: globalIdField('Donation'),
      amount,
      creator,
      wager: wagerId,
      comment,
    });

    const createdDonation = await donation.save();
    await existingWager.save();
    const wagerCreator = await UserModel.findById(req.user._id);
    if (!wagerCreator) {
      throw new Error('User not found.');
    }
    wagerCreator.donations.push(donation._id);
    await creator.save();
    return {
      amount: createdDonation.amount,
    };
  },
  outputFields: {
    amount: {
      type: GraphQLFloat,
      resolve: ({ amount }) => amount,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
