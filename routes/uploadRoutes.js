import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} from "../controllers/uploadController.js";

const router = express.Router();

// Tek resim yükleme
router.post("/single", upload.single("image"), uploadImage);

// Çoklu resim yükleme
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);

// Resim silme (query parameter ile)
router.delete("/", deleteImage);

export default router;
