
import { Schema, model, models } from 'mongoose';

export interface IProduct {
  productId: string;
  content: string;
  tags: string[];
}

const productSchema = new Schema<IProduct>({
  productId: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  tags: { type: [String], required: true },
});

const Product = models.Product || model<IProduct>('Product', productSchema);

export default Product;