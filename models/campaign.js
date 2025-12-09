import mongoose from "mongoose";

/**
 * Campaign Schema for e-commerce campaigns.
 */
const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [200, "Name must be at most 200 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug may contain only lowercase letters, numbers, and hyphens",
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);
