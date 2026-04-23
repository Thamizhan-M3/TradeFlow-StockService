import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true, index: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { versionKey: false }
);

priceHistorySchema.index({ stockId: 1, timestamp: 1 });

export const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);
