import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Configuration
 *
 * Cloudinary servisini yapılandırır.
 * Resim yükleme ve yönetimi için kullanılır.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary bağlantısını test et (opsiyonel)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log("✅ Cloudinary yapılandırıldı");
} else {
  console.warn("⚠️  Cloudinary yapılandırması eksik");
}

export default cloudinary;
