import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

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

router.post("/createAnnouncement", createAnnouncement);
router.get("/getAllAnnouncements", getAnnouncements);
router.get("/getAnnouncementById/:id", getAnnouncementById);
router.put("/updateAnnouncement/:id", updateAnnouncement);
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);

export default router;
