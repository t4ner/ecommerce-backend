import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: [true],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
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
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/cart", cartRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
