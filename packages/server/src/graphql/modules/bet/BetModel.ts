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
  amount: Number;
  creator: Types.ObjectId;
  option: Number;
  wager: Types.ObjectId;
  comment: Types.ObjectId;
}

const BetModel: Model<IBet> = mongoose.model('Bet', betSchema);

export default BetModel;
