import { IUser } from '../user/UserModel';
import { IWager } from '../wager/WagerModel';
import { IComment } from '../comment/CommentModel';
import mongoose, { Document, Model, Types } from 'mongoose';

const Schema = mongoose.Schema;

const betSchema = new Schema(
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
    option: {
      type: Number,
      required: true,
    },
    wager: {
      type: Schema.Types.ObjectId,
      ref: 'Wager',
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

export interface IBet extends Document {
  amount: number;
  creator: IUser;
  option: number;
  wager: IWager;
  comment: IComment;
}

const BetModel: Model<IBet> = mongoose.model('Bet', betSchema);

export default BetModel;
