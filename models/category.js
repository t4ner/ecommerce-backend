import mongoose from "mongoose";

/**
 * Category Schema for e-commerce, supports hierarchical categories.
 */
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
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
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description must be at most 500 characters"],
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Category", CategorySchema);