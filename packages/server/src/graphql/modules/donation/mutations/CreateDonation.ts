import DonationModel from '../DonationModel';
import WagerModel from '../../wager/WagerModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel';
import { CandidateModel } from '../../../../models'

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';
;

export default mutationWithClientMutationId({
  name: 'CreateDonation',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    content: {
      type: GraphQLString,
    },
    wager: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async ({ amount, content, wager }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    if (amount <= 0) {
      throw new Error('Not a valid donation amount');
    }
    const creator = req.user;
    const comment = null;
    const existingWager = await WagerModel.findOne({ _id: wager });
    if (content && existingWager.live) {
      const comment = new CommentModel({
        id: globalIdField('Comment'),
        content,
        creator,
        wager,
      });
      const createdComment = await comment.save();
      existingWager.comments.push(createdComment._id);
      await existingWager.save();
    }

    const donation = new DonationModel({
      id: globalIdField('Donation'),
      amount,
      creator,
      wager,
      comment,
    });

    const createdDonation = await donation.save();
    if(!existingWager.live) {
      const existingCandidate = await CandidateModel.findOne({wager});
      existingCandidate.donations.push(createdDonation);
      existingCandidate.total += createdDonation.amount;
      existingCandidate.save();
  }
    const donationCreator = await UserModel.findById(req.user._id);
    if (!donationCreator) {
      throw new Error('User not found.');
    }
    donationCreator.donations.push(donation._id);
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
