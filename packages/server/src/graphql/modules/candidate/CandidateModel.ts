import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/UserModel';
import { IDonation } from '../donation/DonationModel';
import { IChallenge } from '../../../models';

const Schema = mongoose.Schema;

const candidateSchema = new Schema(
  {
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    rank: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
      },
    ],
  },
  { timestamps: true }
);
export interface ICandidate extends Document {
  total: number;
  rank: number;
  creator: IUser;
  donations: IDonation[];
  challenge: IChallenge;
}

const CandidateModel: Model<ICandidate> = mongoose.model(
  'Candidate',
  candidateSchema
);

export default CandidateModel;
