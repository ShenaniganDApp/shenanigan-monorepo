import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Types } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    addresses: [
      {
        type: String,
        required: false,
        unique: true,
      },
    ],
    DID: {
      type: String,
      required: false,
      unique: true,
    },
    createdChallenges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
      },
    ],
    predictions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prediction",
      },
    ],
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  { timestamps: true, collection: "users" }
);

export interface IUser extends Document {
  username: string;
  addresses: string[];
  DID: string;
  createdChallenges: Types.ObjectId[];
  predictions: Types.ObjectId[];
  donations: Types.ObjectId[];
  authenticate: (plainTextDID: string) => boolean;
  encryptDID: (address: string | undefined) => string;
}

userSchema.pre<IUser>("save", function encryptDIDHook(next) {
  // Hash the password
  if (this.isModified("DID")) {
    this.DID = this.encryptDID(this.DID);
  }

  return next();
});

userSchema.methods = {
  authenticate(plainTextDID: string) {
    return bcrypt.compareSync(plainTextDID, this.DID);
  },
  encryptDID(DID: string) {
    return bcrypt.hashSync(DID, 8);
  },
};

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
