import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Campaign Routes
 *
 * POST   /api/campaigns/createCampaign         - Yeni campaign oluştur
 * GET    /api/campaigns/getAllCampaigns        - Tüm campaign'leri getir
 * GET    /api/campaigns/getCampaignById/:id    - ID'ye göre campaign getir
 * GET    /api/campaigns/getCampaignBySlug/:slug - Slug'a göre campaign getir
 * PUT    /api/campaigns/updateCampaign/:id     - Campaign güncelle
 * DELETE /api/campaigns/deleteCampaign/:id     - Campaign sil
 */

// Public routes (herkes erişebilir)
router.get("/getAllCampaigns", getCampaigns);
router.get("/getCampaignById/:id", getCampaignById);
router.get("/getCampaignBySlug/:slug", getCampaignBySlug);

// Protected routes (token gerekli)
router.post("/createCampaign", protect, createCampaign);
router.put("/updateCampaign/:id", protect, updateCampaign);
router.delete("/deleteCampaign/:id", protect, deleteCampaign);

export default router;
