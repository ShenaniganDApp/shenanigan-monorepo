import mongoose, { Document, Model, Types } from "mongoose";

const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    challengeSeries: {
      type: Number,
      required: true
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge"
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, collection: "donations" }
);

export interface IDonation extends Document {
  amount: number;
  creator: Types.ObjectId;
  comment: Types.ObjectId;
  challengeSeries: number;
  challenge: Types.ObjectId;
  receiver: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DonationModel: Model<IDonation> = mongoose.model(
  "Donation",
  donationSchema
);

export { DonationModel };
