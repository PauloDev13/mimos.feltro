import mongoose, { Document, Model, Schema } from 'mongoose';

interface IModel extends Document {
  //_id?: any;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  reviews: IReview[];
}

interface IReview extends Document {
  //_id?: any;
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    // _id: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const productSchema: Schema<IModel> = new mongoose.Schema(
  {
    //_id: { type: String },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

const Product: Model<IModel> =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
