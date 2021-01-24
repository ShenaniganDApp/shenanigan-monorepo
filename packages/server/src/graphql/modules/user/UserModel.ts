import mongoose, { Document, Model, Types } from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		username: {
			type: String,
		},
		addresses: [
			{
				type: String,
				required: true,
				unique: true,
			},
		],
		burner: {
			type: Boolean,
			required: true,
		},
		createdChallenges: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Challenge',
			},
		],
		predictions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Prediction',
			},
		],
		donations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Donation',
			},
		],
		challengeCards: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ChallengeCards',
			},
		],
		outcomeVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
		skipVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
	},
	{ timestamps: true, collection: 'users' }
);

export interface IUser extends Document {
	username: string;
	addresses: string[];
	burner: boolean;
	createdChallenges: Types.ObjectId[];
	predictions: Types.ObjectId[];
	donations: Types.ObjectId[];
	challengeCards: Types.ObjectId[];
	outcomeVotes: Types.ObjectId[];
	skipVotes: Types.ObjectId[];
}

const UserModel: Model<IUser> = mongoose.model('User', userSchema);

export default UserModel;
