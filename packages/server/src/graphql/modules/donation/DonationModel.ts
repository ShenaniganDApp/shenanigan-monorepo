import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
import { IComment } from '../comment/CommentModel';
import { IWager } from '../../../models';

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
    wager: {
      type: Schema.Types.ObjectId,
      ref:'Wager'
    }
  },
  { timestamps: true }
);

export interface IDonation extends Document {
  amount: number;
  creator: IUser;
  comment: IComment;
  wager: IWager;
}

const DonationModel: Model<IDonation> = mongoose.model('Donation', donationSchema);

export default DonationModel;
