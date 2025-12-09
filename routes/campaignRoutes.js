import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";

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

router.post("/createCampaign", createCampaign);
router.get("/getAllCampaigns", getCampaigns);
router.get("/getCampaignById/:id", getCampaignById);
router.get("/getCampaignBySlug/:slug", getCampaignBySlug);
router.put("/updateCampaign/:id", updateCampaign);
router.delete("/deleteCampaign/:id", deleteCampaign);

export default router;
