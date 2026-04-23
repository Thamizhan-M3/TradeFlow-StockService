import express from "express";
import { PriceHistory } from "../models/PriceHistory.js";
import { Stock } from "../models/Stock.js";

export const stockRouter = express.Router();

const seedStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 212.12, marketCap: 3200000000000, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 428.56, marketCap: 3100000000000, sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 948.24, marketCap: 2300000000000, sector: "Semiconductors" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 196.82, marketCap: 760000000000, sector: "Automotive" }
];

stockRouter.get("/", async (_req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    return res.json(stocks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch stocks", error: error.message });
  }
});

stockRouter.get("/:symbol", async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json(stock);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch stock", error: error.message });
  }
});

stockRouter.get("/:symbol/history", async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const history = await PriceHistory.find({ stockId: stock.id }).sort({ timestamp: 1 }).limit(30);
    return res.json({ stock, history });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch price history", error: error.message });
  }
});

stockRouter.post("/seed", async (_req, res) => {
  try {
    const createdStocks = [];

    for (const item of seedStocks) {
      const stock = await Stock.findOneAndUpdate(
        { symbol: item.symbol },
        { ...item, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      createdStocks.push(stock);

      for (let index = 0; index < 7; index += 1) {
        const offset = 6 - index;
        await PriceHistory.create({
          stockId: stock.id,
          price: Number((stock.price * (0.97 + index * 0.01)).toFixed(2)),
          timestamp: new Date(Date.now() - offset * 60 * 60 * 1000)
        });
      }
    }

    return res.status(201).json(createdStocks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to seed data", error: error.message });
  }
});
