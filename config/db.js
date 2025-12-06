import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || "taanzera";

    await mongoose.connect(process.env.MONGO_URI, { dbName });

    console.log("✅ MongoDB Bağlantısı başarılı:", mongoose.connection.host);
    console.log("📦 Veritabanı:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Bağlantı Hatası:", error.message);
    process.exit(1);
  }
};

export default connectDB;
