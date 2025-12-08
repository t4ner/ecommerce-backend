import multer from "multer";

// Memory storage kullan - dosyayı bellekte tut, Cloudinary'e yükleyeceğiz
const storage = multer.memoryStorage();

// Multer middleware'i
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maksimum dosya boyutu
  },
  fileFilter: (req, file, cb) => {
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Sadece resim dosyaları yüklenebilir!"), false);
    }
  },
});

export default upload;
