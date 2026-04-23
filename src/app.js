import cors from "cors";
import express from "express";
import { stockRouter } from "./routes/stockRoutes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ service: "tradeflow-stock-service", status: "ok" });
  });

  app.use("/api/stocks", stockRouter);

  return app;
}
