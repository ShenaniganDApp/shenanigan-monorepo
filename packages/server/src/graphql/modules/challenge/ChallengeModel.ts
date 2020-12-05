import mongoose, { Document, Model, Types } from 'mongoose';

const { Schema } = mongoose;

const challengeSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
		},
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
		votePeriods: [
			{
				type: [Number],
				validate: [
					(val: Array<Number>) => val.length === 2 && val[0] < val[1],
					'{PATH} was given invalid values',
				],
			},
		],
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
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
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
		challengeCards: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ChallengeCard',
			},
		],
	},
	{ timestamps: true, collection: 'challenges' }
);

export interface IChallenge extends Document {
	address: string;
	title: string;
	content?: string;
	series: number;
	active: boolean;
	options: string[];
	donations: Types.ObjectId[];
	predictions: Types.ObjectId[];
	creator: Types.ObjectId;
	comments: Types.ObjectId[];
	challengeCards: Types.ObjectId[];
	votePeriods: number[][];
	votes: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const ChallengeModel: Model<IChallenge> = mongoose.model('Challenge', challengeSchema);

export { ChallengeModel };
