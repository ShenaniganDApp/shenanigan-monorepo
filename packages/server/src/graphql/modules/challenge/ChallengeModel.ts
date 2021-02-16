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
		live: {
			type: Boolean,
			default: false,
			required: true,
		},
		color: {
			type: String,
			default: `hsl(${360 * Math.random()}, 100%, 55%)`,
			required: true,
		},
		votePeriods: [
			[
				{
					type: Number,
				},
			],
		],
		positiveOptions: [
			{
				type: String,
				required: true,
			},
		],
		negativeOptions: [
			{
				type: String,
				required: true,
			},
		],
		donations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Donation',
			},
		],
		totalDonations: {
			type: Number,
			required: true,
			default: 0,
		},
		outcomeVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
		skipVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
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
	live: boolean;
	positiveOptions: string[];
	negativeOptions: string[];
	color: string;
	donations: Types.ObjectId[];
	predictions: Types.ObjectId[];
	creator: Types.ObjectId;
	comments: Types.ObjectId[];
	challengeCards: Types.ObjectId[];
	votePeriods: number[][];
	outcomeVotes: Types.ObjectId[];
	skipVotes: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const ChallengeModel: Model<IChallenge> = mongoose.model('Challenge', challengeSchema);

export { ChallengeModel };
