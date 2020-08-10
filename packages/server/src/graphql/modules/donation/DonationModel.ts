import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
import { IComment } from '../comment/CommentModel';
import { IChallenge } from '../../../models';

const Schema = mongoose.Schema;

const donationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref:'Challenge'
    }
  },
  { timestamps: true }
);

export interface IDonation extends Document {
  amount: number;
  creator: IUser;
  comment: IComment;
  challenge: IChallenge;
}

const DonationModel: Model<IDonation> = mongoose.model('Donation', donationSchema);

export default DonationModel;
