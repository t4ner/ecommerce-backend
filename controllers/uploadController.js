import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Tek resim yükleme
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Lütfen bir resim dosyası seçin",
      });
    }

    // Buffer'ı stream'e çevir
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "e-taanzera", // Cloudinary'de resimlerin saklanacağı klasör
        resource_type: "image",
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: "limit", // Resimleri maksimum 1000x1000 boyutunda tut
          },
        ],
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Resim yüklenirken hata oluştu",
            error: error.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Resim başarıyla yüklendi",
          data: {
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          },
        });
      }
    );

    // Buffer'ı stream'e yaz
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Resim yüklenirken hata oluştu",
      error: error.message,
    });
  }
};

// Çoklu resim yükleme
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lütfen en az bir resim dosyası seçin",
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "e-taanzera",
            resource_type: "image",
            transformation: [
              {
                width: 1000,
                height: 1000,
                crop: "limit",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            }
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(stream);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${results.length} resim başarıyla yüklendi`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Resimler yüklenirken hata oluştu",
      error: error.message,
    });
  }
};

// Resim silme
export const deleteImage = async (req, res) => {
  try {
    // Query parameter'dan al (URL encode edilmiş olabilir)
    const { public_id } = req.query;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message:
          "Public ID gerekli (query parameter olarak gönderin: ?public_id=...)",
      });
    }

    // URL decode yap (eğer encode edilmişse)
    const decodedPublicId = decodeURIComponent(public_id);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === "ok") {
      res.status(200).json({
        success: true,
        message: "Resim başarıyla silindi",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Resim bulunamadı",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Resim silinirken hata oluştu",
      error: error.message,
    });
  }
};
