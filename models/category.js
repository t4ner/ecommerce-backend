import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    // null ise ana kategori, bir id varsa alt kategori
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // SEO için çok lazım olacak
    description: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Category", CategorySchema);
