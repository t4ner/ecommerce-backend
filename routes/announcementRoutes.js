import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Announcement Routes
 *
 * POST   /api/announcements/createAnnouncement         - Yeni announcement oluştur
 * GET    /api/announcements/getAllAnnouncements        - Tüm announcement'leri getir
 * GET    /api/announcements/getAnnouncementById/:id    - ID'ye göre announcement getir
 * PUT    /api/announcements/updateAnnouncement/:id      - Announcement güncelle
 * DELETE /api/announcements/deleteAnnouncement/:id      - Announcement sil
 */

// Public routes (herkes erişebilir)
router.get("/getAllAnnouncements", getAnnouncements);
router.get("/getAnnouncementById/:id", getAnnouncementById);

// Protected routes (token gerekli)
router.post("/createAnnouncement", protect, createAnnouncement);
router.put("/updateAnnouncement/:id", protect, updateAnnouncement);
router.delete("/deleteAnnouncement/:id", protect, deleteAnnouncement);

export default router;
