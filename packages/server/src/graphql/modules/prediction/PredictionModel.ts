import { IUser } from '../user/UserModel';
import { IChallenge } from '../challenge/ChallengeModel';
import { IComment } from '../comment/CommentModel';
import mongoose, { Document, Model, Types } from 'mongoose';

const Schema = mongoose.Schema;

const predictionSchema = new Schema(
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
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

export interface IPrediction extends Document {
  amount: number;
  creator: IUser;
  option: number;
  challenge: IChallenge;
  comment: IComment;
}

const PredictionModel: Model<IPrediction> = mongoose.model('Prediction', predictionSchema);

export default PredictionModel;
