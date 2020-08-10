import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
import { IPrediction } from '../prediction/PredictionModel';
import { IComment } from '../comment/CommentModel';
const Schema = mongoose.Schema;

const challengeSchema = new Schema(
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
    predictions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Prediction'
      }
    ]
  },
  { timestamps: true, collection: 'challenges' }
);

export interface IChallenge extends Document {
  title: string;
  content?: string;
  live: boolean;
  options: string[];
  predictions: IPrediction[];
  creator: IUser;
  comments: IComment[]
}

const ChallengeModel: Model<IChallenge> = mongoose.model('Challenge', challengeSchema);

export default ChallengeModel;
