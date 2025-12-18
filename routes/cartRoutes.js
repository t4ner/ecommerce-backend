import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Cart Routes
 *
 * GET    /api/cart/getCart                    - Kullanıcının sepetini getir
 * POST   /api/cart/addToCart                  - Sepete ürün ekle
 * PUT    /api/cart/updateCartItem/:productId  - Sepetteki ürün miktarını güncelle
 * DELETE /api/cart/removeFromCart/:productId  - Sepetten ürün sil
 * DELETE /api/cart/clearCart                  - Sepeti temizlen
 */

// Tüm sepet işlemleri için authentication gerekli
router.get("/getCart", protect, getCart);
router.post("/addToCart", protect, addToCart);
router.put("/updateCartItem/:productId", protect, updateCartItem);
router.delete("/removeFromCart/:productId", protect, removeFromCart);
router.delete("/clearCart", protect, clearCart);

export default router;
