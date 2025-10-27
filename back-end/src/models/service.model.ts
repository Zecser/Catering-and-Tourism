import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  heading?: string;
  description?: string; 
  image?: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    heading: { type: String }, 
    description: { type: String }, 
    image: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
