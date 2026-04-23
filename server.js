import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = Number(process.env.PORT || 4002);
const mongoUri = process.env.MONGODB_URI;

const app = createApp();

connectDatabase(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`tradeflow-stock-service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start stock service", error);
    process.exit(1);
  });
