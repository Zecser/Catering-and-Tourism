import mongoose, { Schema, Document } from 'mongoose';

interface IPackage extends Document {
  title: string;
  description: string;
  price: number;
  features: string[];
}

const PackageSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], required: true },
});

const Package = mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
