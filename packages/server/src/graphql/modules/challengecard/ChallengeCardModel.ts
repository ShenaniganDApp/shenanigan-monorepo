import mongoose, { Document, Model, Types } from "mongoose";

const { Schema } = mongoose;

const challengeCardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    address: {
      type: String,
    },
    ipfs: {
      type: String,
      required: true,
    },
    streamUrl: {
      type: String,
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    resultType: {
      type: Boolean,
    },
    price: {
      type: Number,
      required: true,
    },
    totalMint: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
  },
  { timestamps: true, collection: "challengecards" }
);

export interface IChallengeCard extends Document {
  title: string;
  content?: string;
  address: string;
  ipfs: string;
  streamUrl: string;
  result: number;
  resultType: boolean;
  price: number;
  totalMint: number;
  creator: Types.ObjectId;
  challenge: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeCardModel: Model<IChallengeCard> = mongoose.model(
  "ChallengeCard",
  challengeCardSchema
);

export default ChallengeCardModel;
