import mongoose, { Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    createdWagers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Wager'
      }
    ],
    bets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bet'
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
  createdWagers: Types.ObjectId[];
  bets: Types.ObjectId[];
  donations: Types.ObjectId[];
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