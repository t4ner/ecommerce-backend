import mongoose from "mongoose";

/**
 * Announcement Schema for e-commerce announcements.
 */
const AnnouncementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
