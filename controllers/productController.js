import Product from "../models/product.js";
import Category from "../models/category.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    stock,
    images,
    category,
    subCategory,
    isFeatured,
    isActive,
  } = req.body;

  if (await Product.findOne({ slug: slug.trim().toLowerCase() })) {
    return sendError(res, "This slug is already in use", 400);
  }

  if (!(await Category.findById(category))) {
    return sendError(res, "Category not found", 404);
  }

  if (subCategory && !(await Category.findById(subCategory))) {
    return sendError(res, "SubCategory not found", 404);
  }

  if (!images || images.length === 0) {
    return sendError(res, "At least one image is required", 400);
  }

  const product = await Product.create({
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    description: description?.trim() ?? "",
    price: parseFloat(price),
    stock: parseInt(stock) || 0,
    images: images,
    category: category,
    subCategory: subCategory || null,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    isActive: isActive !== undefined ? isActive : true,
  });

  await product.populate("category", "name slug");
  if (product.subCategory) {
    await product.populate("subCategory", "name slug");
  }

  return sendSuccess(res, product, "Product created successfully", 201);
});

export const getProducts = asyncHandler(async (req, res) => {
  const { isActive, isFeatured, category, subCategory } = req.query;
  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }
  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === "true";
  }
  if (category) {
    query.category = category;
  }
  if (subCategory) {
    query.subCategory = subCategory;
  }

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ createdAt: -1 });

  return sendSuccess(res, products, "Products fetched successfully");
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("subCategory", "name slug");

  if (!product) {
    return sendError(res, "Product not found", 404);
  }
  return sendSuccess(res, product, "Product fetched successfully");
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("subCategory", "name slug");

  if (!product) {
    return sendError(res, "Product not found", 404);
  }
  return sendSuccess(res, product, "Product fetched successfully");
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    price,
    stock,
    images,
    category,
    subCategory,
    isFeatured,
    isActive,
  } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  if (slug && slug.trim().toLowerCase() !== product.slug) {
    if (
      await Product.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id },
      })
    ) {
      return sendError(res, "This slug is already in use", 400);
    }
  }

  if (category && !(await Category.findById(category))) {
    return sendError(res, "Category not found", 404);
  }

  if (subCategory && !(await Category.findById(subCategory))) {
    return sendError(res, "SubCategory not found", 404);
  }

  if (images && images.length === 0) {
    return sendError(res, "At least one image is required", 400);
  }

  if (name !== undefined) product.name = name.trim();
  if (slug !== undefined) product.slug = slug.trim().toLowerCase();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = parseFloat(price);
  if (stock !== undefined) product.stock = parseInt(stock);
  if (images !== undefined) product.images = images;
  if (category !== undefined) product.category = category;
  if (subCategory !== undefined) product.subCategory = subCategory || null;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();
  await product.populate("category", "name slug");
  if (product.subCategory) {
    await product.populate("subCategory", "name slug");
  }

  return sendSuccess(res, product, "Product updated successfully");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return sendError(res, "Product not found", 404);
  }
  await Product.findByIdAndDelete(id);
  return sendSuccess(res, null, "Product deleted successfully");
});

export const getActiveProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ createdAt: -1 });

  return sendSuccess(res, products, "Active products fetched successfully");
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ createdAt: -1 });

  return sendSuccess(res, products, "Featured products fetched successfully");
});
