import Category from "../models/Category.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, parentId, description, imageUrl, isVisible } = req.body;
  if (await Category.findOne({ slug })) {
    return sendError(res, "This slug is already in use", 400);
  }
  if (parentId && !(await Category.findById(parentId))) {
    return sendError(res, "Parent category not found", 404);
  }
  const category = await Category.create({
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    parentId: parentId || null,
    description: description?.trim() ?? "",
    imageUrl: imageUrl?.trim() ?? "",
    isVisible: isVisible !== undefined ? isVisible : false,
  });
  return sendSuccess(res, category, "Category created successfully", 201);
});

export const getCategories = asyncHandler(async (req, res) => {
  const { isVisible } = req.query;
  const query = {};
  if (isVisible !== undefined) {
    query.isVisible = isVisible === "true";
  }
  const categories = await Category.find(query).sort({ createdAt: -1 });
  return sendSuccess(res, categories, "Categories fetched successfully");
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  if (!category) {
    return sendError(res, "Category not found", 404);
  }
  return sendSuccess(res, category, "Category fetched successfully");
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return sendError(res, "Category not found", 404);
  }
  return sendSuccess(res, category, "Category fetched successfully");
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, parentId, description, imageUrl, isVisible } = req.body;
  const category = await Category.findById(id);
  if (!category) {
    return sendError(res, "Category not found", 404);
  }
  if (slug && slug.trim().toLowerCase() !== category.slug) {
    if (
      await Category.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id },
      })
    ) {
      return sendError(res, "This slug is already in use", 400);
    }
  }
  if (parentId) {
    if (parentId === id) {
      return sendError(res, "A category cannot be its own parent", 400);
    }
    if (!(await Category.findById(parentId))) {
      return sendError(res, "Parent category not found", 404);
    }
  }
  category.name = name?.trim() ?? category.name;
  category.slug = slug?.trim().toLowerCase() ?? category.slug;
  category.parentId =
    parentId === undefined ? category.parentId : parentId || null;
  category.description = description?.trim() ?? category.description;
  category.imageUrl = imageUrl?.trim() ?? category.imageUrl;
  if (isVisible !== undefined) {
    category.isVisible = isVisible;
  }
  await category.save();
  return sendSuccess(res, category, "Category updated successfully");
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return sendError(res, "Category not found", 404);
  }
  if (await Category.findOne({ parentId: id })) {
    return sendError(
      res,
      "Category has subcategories. Please delete them first.",
      400
    );
  }
  await Category.findByIdAndDelete(id);
  return sendSuccess(res, null, "Category deleted successfully");
});

export const getCategoriesTree = asyncHandler(async (req, res) => {
  const { isVisible } = req.query;
  const query = {};
  if (isVisible !== undefined) {
    query.isVisible = isVisible === "true";
  }
  const categories = await Category.find(query).lean();
  const categoryMap = {};
  categories.forEach((category) => {
    categoryMap[category._id.toString()] = { ...category, children: [] };
  });
  const tree = [];
  categories.forEach((category) => {
    if (category.parentId) {
      const parent = categoryMap[category.parentId.toString()];
      if (parent) parent.children.push(categoryMap[category._id.toString()]);
    } else {
      tree.push(categoryMap[category._id.toString()]);
    }
  });
  return sendSuccess(res, tree, "Category tree fetched successfully");
});

export const getAllCategoriesTree = getCategoriesTree;

export const getVisibleCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isVisible: true }).sort({
    createdAt: -1,
  });
  return sendSuccess(
    res,
    categories,
    "Visible categories fetched successfully"
  );
});
