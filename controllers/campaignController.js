import Campaign from "../models/campaign.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCampaign = asyncHandler(async (req, res) => {
  const { name, imageUrl, slug } = req.body;
  if (await Campaign.findOne({ slug })) {
    return sendError(res, "This slug is already in use", 400);
  }
  const campaign = await Campaign.create({
    name: name.trim(),
    imageUrl: imageUrl.trim(),
    slug: slug.trim().toLowerCase(),
  });
  return sendSuccess(res, campaign, "Campaign created successfully", 201);
});

export const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  return sendSuccess(res, campaigns, "Campaigns fetched successfully");
});

export const getCampaignBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const campaign = await Campaign.findOne({ slug });
  if (!campaign) {
    return sendError(res, "Campaign not found", 404);
  }
  return sendSuccess(res, campaign, "Campaign fetched successfully");
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return sendError(res, "Campaign not found", 404);
  }
  return sendSuccess(res, campaign, "Campaign fetched successfully");
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl, slug } = req.body;
  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return sendError(res, "Campaign not found", 404);
  }
  if (slug && slug.trim().toLowerCase() !== campaign.slug) {
    if (
      await Campaign.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id },
      })
    ) {
      return sendError(res, "This slug is already in use", 400);
    }
  }
  campaign.name = name?.trim() ?? campaign.name;
  campaign.imageUrl = imageUrl?.trim() ?? campaign.imageUrl;
  campaign.slug = slug?.trim().toLowerCase() ?? campaign.slug;
  await campaign.save();
  return sendSuccess(res, campaign, "Campaign updated successfully");
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return sendError(res, "Campaign not found", 404);
  }
  await Campaign.findByIdAndDelete(id);
  return sendSuccess(res, null, "Campaign deleted successfully");
});
