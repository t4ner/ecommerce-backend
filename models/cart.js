import mongoose from "mongoose";

/**
 * Cart Schema for e-commerce shopping cart.
 */
const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: true }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

// Her kullanıcının tek bir sepeti olmasını sağla
CartSchema.index({ user: 1 }, { unique: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
