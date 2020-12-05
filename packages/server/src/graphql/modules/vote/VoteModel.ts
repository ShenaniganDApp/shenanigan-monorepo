import mongoose, { Document, Model, Types } from "mongoose";

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    choice: {
      type: Number,
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeSeries: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "votes" }
);

export interface IVote extends Document {
  choice: number;
  creator: Types.ObjectId;
  challengeSeries: number;
  challenge: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VoteModel: Model<IVote> = mongoose.model("Vote", voteSchema);

export { VoteModel };
