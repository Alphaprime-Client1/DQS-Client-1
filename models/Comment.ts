import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  qrId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  parentId: mongoose.Types.ObjectId | null;
  isEdited: boolean;
  editCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    qrId: { type: Schema.Types.ObjectId, ref: "QRCode", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    isEdited: { type: Boolean, default: false },
    editCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
