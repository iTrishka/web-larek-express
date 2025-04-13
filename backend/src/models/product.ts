import mongoose from "mongoose";

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description: string;
  price: number;
}

const imageSchema = new mongoose.Schema({
  fileName: { type: String },
  originalName: { type: String },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: imageSchema,
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: null },
});

export default mongoose.model<IProduct>("product", productSchema);
