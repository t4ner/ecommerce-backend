import express from "express";
import {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
  getActiveProducts,
  getFeaturedProducts,
  getProductsByCategorySlug,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Product Routes
 *
 * POST   /api/products/createProduct                - Yeni ürün oluştur
 * GET    /api/products/getAllProducts              - Tüm ürünleri getir
 * GET    /api/products/getProductBySlug/:slug      - Slug'a göre ürün getir
 * GET    /api/products/getProductById/:id          - ID'ye göre ürün getir
 * PUT    /api/products/updateProduct/:id           - Ürün güncelle
 * DELETE /api/products/deleteProduct/:id           - Ürün sil
 * GET    /api/products/getActiveProducts           - Sadece aktif ürünleri getir
 * GET    /api/products/getFeaturedProducts         - Öne çıkan ürünleri getir
 * GET    /api/products/getProductsByCategorySlug/:slug - Kategori slug'ına göre ürünleri getir
 */

// Public routes (herkes erişebilir)
router.get("/getAllProducts", getProducts);
router.get("/getProductBySlug/:slug", getProductBySlug);
router.get("/getProductById/:id", getProductById);
router.get("/getActiveProducts", getActiveProducts);
router.get("/getFeaturedProducts", getFeaturedProducts);
router.get("/getProductsByCategorySlug/:slug", getProductsByCategorySlug);

// Protected routes (token gerekli)
router.post("/createProduct", protect, createProduct);
router.put("/updateProduct/:id", protect, updateProduct);
router.delete("/deleteProduct/:id", protect, deleteProduct);

export default router;
