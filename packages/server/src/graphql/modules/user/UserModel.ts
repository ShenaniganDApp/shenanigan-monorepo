import mongoose, { Document, Model, Types } from 'mongoose';
import { IChallenge } from '../challenge/ChallengeModel';
import { IPrediction } from '../prediction/PredictionModel';
import bcrypt from 'bcryptjs';
import { IDonation } from '../donation/DonationModel';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    // addresses: [
    //   {
    //     type: String,
    //     required: false,
    //     unique: true,
    //     lowercase: true
    //   }
    // ],
    createdChallenges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Challenge'
      }
    ],
    predictions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Prediction'
      }
    ],
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Donation'
      }
    ],
  },
  { timestamps: true, collection: 'users' }
);

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdChallenges: IChallenge[];
  predictions: IPrediction[];
  donations: IDonation[];
  authenticate: (plainTextPassword: string) => boolean;
  encryptPassword: (password: string | undefined) => string;
}

userSchema.pre<IUser>('save', function encryptPasswordHook(next) {
  // Hash the password
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

userSchema.methods = {
  authenticate(plainTextPassword: string) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  }
};

const UserModel: Model<IUser> = mongoose.model('User', userSchema);

export default UserModel;