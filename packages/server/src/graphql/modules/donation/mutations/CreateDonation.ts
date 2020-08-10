import DonationModel from '../DonationModel';
import ChallengeModel from '../../challenge/ChallengeModel';
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
import { GraphQLContext } from '../../../TypeDefinition';
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
    challenge: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async ({ amount, content, challenge }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }
    if (amount <= 0) {
      throw new Error('Not a valid donation amount');
    }
    const creator = user;
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
    });

    const createdDonation = await donation.save();
    if(!existingChallenge.live) {
      const existingCandidate = await CandidateModel.findOne({challenge});
      existingCandidate.donations.push(createdDonation);
      existingCandidate.total += createdDonation.amount;
      existingCandidate.save();
  }
    const donationCreator = await UserModel.findById(user._id);
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
