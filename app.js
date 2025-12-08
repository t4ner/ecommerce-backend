import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev")); // Always use dev log

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is working 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
