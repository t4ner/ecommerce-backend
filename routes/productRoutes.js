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
} from "../controllers/productController.js";

const router = express.Router();

/**
 * Product Routes
 *
 * POST   /api/products/createProduct         - Yeni ürün oluştur
 * GET    /api/products/getAllProducts       - Tüm ürünleri getir
 * GET    /api/products/getProductBySlug/:slug - Slug'a göre ürün getir
 * GET    /api/products/getProductById/:id    - ID'ye göre ürün getir
 * PUT    /api/products/updateProduct/:id    - Ürün güncelle
 * DELETE /api/products/deleteProduct/:id    - Ürün sil
 * GET    /api/products/getActiveProducts    - Sadece aktif ürünleri getir
 * GET    /api/products/getFeaturedProducts  - Öne çıkan ürünleri getir
 */

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getProducts);
router.get("/getProductBySlug/:slug", getProductBySlug);
router.get("/getProductById/:id", getProductById);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.get("/getActiveProducts", getActiveProducts);
router.get("/getFeaturedProducts", getFeaturedProducts);

export default router;
