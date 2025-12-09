import Announcement from "../models/announcement.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return sendError(res, "Message is required and must not be empty", 400);
  }
  const announcement = await Announcement.create({
    message: message.trim(),
  });
  return sendSuccess(
    res,
    announcement,
    "Announcement created successfully",
    201
  );
});

export const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  return sendSuccess(res, announcements, "Announcements fetched successfully");
});

export const getAnnouncementById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return sendError(res, "Announcement not found", 404);
  }
  return sendSuccess(res, announcement, "Announcement fetched successfully");
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return sendError(res, "Announcement not found", 404);
  }
  if (message) {
    if (typeof message !== "string" || message.trim().length === 0) {
      return sendError(res, "Message must be a non-empty string", 400);
    }
    announcement.message = message.trim();
  }
  await announcement.save();
  return sendSuccess(res, announcement, "Announcement updated successfully");
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);
  if (!announcement) {
    return sendError(res, "Announcement not found", 404);
  }
  await Announcement.findByIdAndDelete(id);
  return sendSuccess(res, null, "Announcement deleted successfully");
});
