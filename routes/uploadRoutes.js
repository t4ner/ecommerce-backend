import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} from "../controllers/uploadController.js";

const router = express.Router();

/**
 * Upload Routes
 *
 * POST   /api/upload/single    - Tek resim yükle (form field: "image")
 * POST   /api/upload/multiple  - Çoklu resim yükle (form field: "images", maksimum 10)
 * DELETE /api/upload?public_id=... - Resim sil
 */

router.post("/single", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);
router.delete("/", deleteImage);

export default router;
