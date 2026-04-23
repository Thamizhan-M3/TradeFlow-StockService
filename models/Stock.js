import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    marketCap: { type: Number, default: 0 },
    sector: { type: String, default: "Technology" },
    updatedAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const Stock = mongoose.model("Stock", stockSchema);
