import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getAllCategoriesTree,
  getVisibleCategories,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Category Routes
 *
 * POST   /api/categories/createCategory         - Yeni kategori oluştur
 * GET    /api/categories/getAllCategories      - Tüm kategorileri getir
 * DELETE /api/categories/deleteCategory/:id    - Kategori sil
 * PUT    /api/categories/updateCategory/:id    - Kategori güncelle
 * GET    /api/categories/getCategoryBySlug/:slug - Slug'a göre kategori getir
 * GET    /api/categories/getAllCategoriesTree  - Kategorileri ağaç yapısında getir
 * GET    /api/categories/getVisibleCategories  - Sadece görünür kategorileri getir
 */

// Public routes (herkes erişebilir)
router.get("/getAllCategories", getCategories);
router.get("/getCategoryBySlug/:slug", getCategoryBySlug);
router.get("/getAllCategoriesTree", getAllCategoriesTree);
router.get("/getVisibleCategories", getVisibleCategories);

// Protected routes (token gerekli)
router.post("/createCategory", protect, createCategory);
router.put("/updateCategory/:id", protect, updateCategory);
router.delete("/deleteCategory/:id", protect, deleteCategory);

export default router;
