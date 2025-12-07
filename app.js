import express from "express";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";

const app = express();

// Database bağlantısını başlat
connectDB();

// Middleware sırası önemli!
app.use(cors()); // Önce CORS
app.use(express.json()); // Sonra JSON parser
app.use(express.urlencoded({ extended: true })); // URL encoded data

// Root route
app.get("/", (req, res) => {
  console.log("API Çalışıyor");
  res.send("API Çalışıyor");
});

// API Routes
app.use("/api/categories", categoryRoutes);

// Sunucuyu başlat (EN SON)
app.listen(5858, () => {
  console.log(`🚀 Server 5858 portunda çalışıyor`);
  console.log(`📍 API URL: http://localhost:5858`);
});
