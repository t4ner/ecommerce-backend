import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getAllCategoriesTree,
} from "../controllers/categoryController.js";
import { validateCategory } from "../middleware/validator.js";

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
 */

router.post("/createCategory", validateCategory, createCategory);
router.get("/getAllCategories", getCategories);
router.delete("/deleteCategory/:id", deleteCategory);
router.put("/updateCategory/:id", validateCategory, updateCategory);
router.get("/getCategoryBySlug/:slug", getCategoryBySlug);
router.get("/getAllCategoriesTree", getAllCategoriesTree);

export default router;
