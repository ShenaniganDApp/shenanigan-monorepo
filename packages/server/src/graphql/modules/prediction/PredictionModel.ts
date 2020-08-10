import { IUser } from '../user/UserModel';
import { IChallenge } from '../challenge/ChallengeModel';
import { IComment } from '../comment/CommentModel';
import mongoose, { Document, Model, Types } from 'mongoose';

const Schema = mongoose.Schema;

const predictionSchema = new Schema(
	{
		cards: [
			{
				type: String,
				required: true,
			},
		],
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		option: {
			type: Number,
			required: true,
		},
		opponent: {
			type: Schema.Types.ObjectId,
			ref: 'Prediction',
			default: null,
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
		blockTimestamp: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export interface IPrediction extends Document {
	cards: string[];
	creator: IUser;
	option: number;
	opponent: IPrediction | null;
	challenge: IChallenge;
	comment: IComment;
	blockTimestamp: number;
}

const PredictionModel: Model<IPrediction> = mongoose.model('Prediction', predictionSchema);

export default PredictionModel;
