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
	},
	{ timestamps: true, collection: 'users' }
);

export interface IUser extends Document {
	username: string;
	addresses: string[];
	createdChallenges: Types.ObjectId[];
	predictions: Types.ObjectId[];
	donations: Types.ObjectId[];
}

const UserModel: Model<IUser> = mongoose.model('User', userSchema);

export default UserModel;
