import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  ProductPrice: { type: Number, required: true },
  ProductCurrency: { type: String, required: true },
  ProductCategory: { type: String, required: true },
  ProductDescription: { type: String, required: true },
  ProductTags: { type: Array, required: true },
  ProductImage: { type: String, required: true },
});

const API = mongoose.model("API-data", dataSchema);

export default API;
