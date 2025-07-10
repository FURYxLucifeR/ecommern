import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderProduct {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: IOrderProduct[];
  address: string;
  shipping: string;
  status: string;
  total: number;
  createdAt: Date;
  cancelable: boolean;
}

const OrderProductSchema = new Schema<IOrderProduct>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [OrderProductSchema],
  address: { type: String, required: true },
  shipping: { type: String, required: true },
  status: { type: String, default: 'pending' },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  cancelable: { type: Boolean, default: true },
});

export default mongoose.model<IOrder>('Order', OrderSchema); 