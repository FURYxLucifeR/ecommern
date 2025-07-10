import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: string;
  rating: number;
  isDeleted: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema); 