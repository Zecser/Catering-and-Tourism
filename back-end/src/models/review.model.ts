import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  rating: number; // 1-5
  comment: string;
  source?: string; // e.g., Google
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    source: { type: String, default: "Google" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;


