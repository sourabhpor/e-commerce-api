// ProductModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number,
  reserved: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Product", productSchema);
