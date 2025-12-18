import express from "express";
import {
  createBanner,
  getBanners,
  getBannerBySlug,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Banner Routes
 *
 * POST   /api/banners/createBanner         - Yeni banner oluştur
 * GET    /api/banners/getAllBanners        - Tüm banner'ları getir
 * GET    /api/banners/getBannerById/:id    - ID'ye göre banner getir
 * GET    /api/banners/getBannerBySlug/:slug - Slug'a göre banner getir
 * PUT    /api/banners/updateBanner/:id     - Banner güncelle
 * DELETE /api/banners/deleteBanner/:id     - Banner sil
 */

// Public routes (herkes erişebilir)
router.get("/getAllBanners", getBanners);
router.get("/getBannerById/:id", getBannerById);
router.get("/getBannerBySlug/:slug", getBannerBySlug);

// Protected routes (token gerekli)
router.post("/createBanner", protect, createBanner);
router.put("/updateBanner/:id", protect, updateBanner);
router.delete("/deleteBanner/:id", protect, deleteBanner);

export default router;
