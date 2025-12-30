import Banner from "../models/banner.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBanner = asyncHandler(async (req, res) => {
  const { title, imageUrl, imageUrlMobile, slug } = req.body;
  if (await Banner.findOne({ slug })) {
    return sendError(res, "This slug is already in use", 400);
  }
  const banner = await Banner.create({
    title: title.trim(),
    imageUrl: imageUrl.trim(),
    imageUrlMobile: imageUrlMobile?.trim(),
    slug: slug.trim().toLowerCase(),
  });
  return sendSuccess(res, banner, "Banner created successfully", 201);
});

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  return sendSuccess(res, banners, "Banners fetched successfully");
});

export const getBannerBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const banner = await Banner.findOne({ slug });
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }
  return sendSuccess(res, banner, "Banner fetched successfully");
});

export const getBannerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }
  return sendSuccess(res, banner, "Banner fetched successfully");
});

export const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, imageUrlMobile, slug } = req.body;
  const banner = await Banner.findById(id);
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }
  if (slug && slug.trim().toLowerCase() !== banner.slug) {
    if (
      await Banner.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id },
      })
    ) {
      return sendError(res, "This slug is already in use", 400);
    }
  }
  banner.title = title?.trim() ?? banner.title;
  banner.imageUrl = imageUrl?.trim() ?? banner.imageUrl;
  if (imageUrlMobile !== undefined) {
    banner.imageUrlMobile = imageUrlMobile?.trim() ?? null;
  }
  banner.slug = slug?.trim().toLowerCase() ?? banner.slug;
  await banner.save();
  return sendSuccess(res, banner, "Banner updated successfully");
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }
  await Banner.findByIdAndDelete(id);
  return sendSuccess(res, null, "Banner deleted successfully");
});
