import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  category: string; // ADD THIS
  images?: {
    url: string;
    public_id: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ["Tourism", "Catering"] // ADD THIS - ensures only these values allowed
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

const Blog = model<IBlog>("Blog", blogSchema);
export default Blog;