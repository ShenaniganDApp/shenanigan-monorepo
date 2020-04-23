import mongoose, {Document, Types, Model } from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    wager: {
      type: Schema.Types.ObjectId,
      ref: "Wager",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export interface IComment extends Document {
  wager: Types.ObjectId;
  content: string;
  creator: Types.ObjectId;
}

const CommentModel: Model<IComment> = mongoose.model('Comment', commentSchema);

export default CommentModel;
