import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
const Schema = mongoose.Schema;

const wagerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    live: {
      type: Boolean,
      default: false,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    options: [
      {
        type: String,
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    // bets: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Bet'
    //   }
    // ]
  },
  { timestamps: true, collection: 'wagers' }
);

export interface IWager extends Document {
  title: string;
  content?: string;
  live: boolean;
  options: string[];
  creator: Types.ObjectId;
  comments: Types.ObjectId[]
}

const WagerModel: Model<IWager> = mongoose.model('Wager', wagerSchema);

export default WagerModel;
