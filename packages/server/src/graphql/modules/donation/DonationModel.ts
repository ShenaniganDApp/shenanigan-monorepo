import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
import { IComment } from '../comment/CommentModel';

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
  },
  { timestamps: true }
);

export interface IDonation extends Document {
  amount: Number;
  creator: IUser;
  comment: IComment;
}

const DonationModel: Model<IDonation> = mongoose.model('Donation', donationSchema);

export default DonationModel;
