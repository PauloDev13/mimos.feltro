import mongoose, { Document, Model, Schema } from 'mongoose';

interface IModel extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema: Schema<IModel> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const User: Model<IModel> =
  mongoose.models.User || mongoose.model<IModel>('User', userSchema);
export default User;
