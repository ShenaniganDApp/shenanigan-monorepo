import mongoose, { Document, Model, Types } from 'mongoose';

const { Schema } = mongoose;

const challengeSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
		},
		series: {
			type: Number,
			required: true,
			default: 0,
		},
		active: {
			type: Boolean,
			default: true,
			required: true,
		},
		options: [
			{
				type: String,
			},
		],
		donations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Donation',
			},
		],
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
		predictions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Prediction',
			},
		],
	},
	{ timestamps: true, collection: 'challenges' }
);

export interface IChallenge extends Document {
	title: string;
	content?: string;
	series: number;
	active: boolean;
	options: string[];
	donations: Types.ObjectId[];
	predictions: Types.ObjectId[];
	creator: Types.ObjectId;
	comments: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const ChallengeModel: Model<IChallenge> = mongoose.model('Challenge', challengeSchema);

export { ChallengeModel };
