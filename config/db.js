import mongoose from "mongoose";

/**
 * MongoDB Database Connection
 *
 * Mongoose kullanarak MongoDB'ye bağlanır.
 * Bağlantı başarısız olursa uygulama kapanır.
 */
const connectDB = async () => {
  try {
    // MongoDB bağlantı seçenekleri
    const options = {
      dbName: process.env.DB_NAME || "taanzera",
      // Modern MongoDB driver ayarları
      serverSelectionTimeoutMS: 5000, // 5 saniye içinde bağlanamazsa hata ver
      socketTimeoutMS: 45000, // 45 saniye timeout
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    console.log("✅ MongoDB bağlantısı başarılı");
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`📦 Veritabanı: ${mongoose.connection.name}`);

    // Bağlantı hatalarını dinle
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB bağlantı hatası:", err);
    });

    // Bağlantı koptuğunda
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB bağlantısı kesildi");
    });
  } catch (error) {
    console.error("❌ MongoDB bağlantı hatası:", error.message);
    // Production'da graceful shutdown yapılabilir
    process.exit(1);
  }
};

export default connectDB;
