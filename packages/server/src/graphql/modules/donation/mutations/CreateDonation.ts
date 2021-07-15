import { GraphQLNonNull, GraphQLString } from "graphql";
import {
  globalIdField,
  mutationWithClientMutationId,
  toGlobalId,
} from "graphql-relay";
import { ChallengeLoader, DonationLoader } from "../../../loaders";

import { GraphQLContext } from "../../../TypeDefinition";
import { errorField } from "../../../utils/errorField";
import { successField } from "../../../utils/successField";
import { ChallengeModel } from "../../challenge/ChallengeModel";
import { ChallengeType } from "../../challenge/ChallengeType";
import { CommentModel } from "../../comment/CommentModel";
import { CommentType } from "../../comment/CommentType";
import { DonationModel } from "../DonationModel";
import { DonationConnection } from "../DonationType";
import { BigNumber } from "ethers";

export const CreateDonation = mutationWithClientMutationId({
  name: "CreateDonation",
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: GraphQLString,
    },
    challenge: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async (
    { amount, content, challenge },
    { user }: GraphQLContext
  ) => {
    if (!user)
      return {
        error: "User not logged in",
      };

    if (/^[0-9]*$/.test(amount) === false)
      return {
        error: "Donation must be a number",
      };

    if (amount.length === 0 || !BigNumber.from(amount).gt(0))
      return {
        error: "Donation must be greater than 0",
      };

    const creator = user._id;
    let comment = null;
    const existingChallenge = await ChallengeModel.findOne({ _id: challenge });
    if (!existingChallenge) {
      return {
        error: "Challenge does not exist",
      };
    }
    if (content && existingChallenge.active) {
      comment = new CommentModel({
        id: globalIdField("Comment"),
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
      id: globalIdField("Donation"),
      amount,
      creator,
      challenge,
      comment,
      receiver: existingChallenge.creator,
      challengeSeries: existingChallenge.series,
    });

    const createdDonation = await donation.save();
    existingChallenge.donations.push(createdDonation._id);
    existingChallenge.totalDonations = BigNumber.from(
      existingChallenge.totalDonations
    )
      .add(BigNumber.from(amount))
      .toString();
    existingChallenge.save();

    user.donations.push(donation._id);
    await user.save();
    return {
      id: createdDonation._id,
      challenge: challenge._id,
      comment: comment ? comment._id : null,
      error: null,
    };
  },
  outputFields: {
    donationEdge: {
      type: DonationConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        // Load new edge from loader
        const donation = await DonationLoader.load(context, id);

        // Returns null if no node was loaded
        if (!donation) {
          return null;
        }

        return {
          cursor: toGlobalId("Donation", donation._id),
          node: donation,
        };
      },
    },
    challenge: {
      type: ChallengeType,
      resolve: async ({ challenge }, _, context) => {
        const donationChallenge = await ChallengeLoader.load(
          context,
          challenge
        );
        return donationChallenge;
      },
    },
    comment: {
      type: CommentType,
      resolve: async ({ comment }, _, context) => {
        const donationComment = await ChallengeLoader.load(context, comment);
        return donationComment;
      },
    },
    ...successField,
    ...errorField,
  },
});
