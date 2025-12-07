import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoriesTree,
} from "../controllers/categoryController.js";

const router = express.Router();

// Yeni kategori
router.post("/createCategory", createCategory);

// Tüm kategoriler
router.get("/getAllCategories", getCategories);

// Ağaç yapısında tüm kategoriler
router.get("/getAllCategoriesTree", getCategoriesTree);

// Slug'a göre kategori
router.get("/getCategoryBySlug/:slug", getCategoryBySlug);

// Kategori güncelle
router.put("/updateCategory/:id", updateCategory);

// Kategori sil
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
