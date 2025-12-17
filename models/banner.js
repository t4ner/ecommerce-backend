import mongoose from "mongoose";

/**
 * Banner/Hero Schema for e-commerce homepage banners.
 */
const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
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
        /^[a-z0-9-/]+$/,
        "Slug may contain only lowercase letters, numbers, hyphens, and forward slashes",
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
