import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CLOUDINARY_FOLDER = "e-taanzera";
const UPLOAD_OPTIONS = {
  folder: CLOUDINARY_FOLDER,
  resource_type: "image",
  transformation: [{ width: 1000, height: 1000, crop: "limit" }],
};

const uploadBufferToCloudinary = (buffer, options = UPLOAD_OPTIONS) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });
    });
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return sendError(res, "Please select an image file", 400);
  const result = await uploadBufferToCloudinary(req.file.buffer);
  return sendSuccess(res, result, "Image uploaded successfully");
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files?.length)
    return sendError(res, "Please select at least one image file", 400);

  const results = await Promise.all(
    req.files.map(file => uploadBufferToCloudinary(file.buffer))
  );
  return sendSuccess(res, results, `${results.length} images uploaded successfully`);
});

export const deleteImage = asyncHandler(async (req, res) => {
  const { public_id } = req.query;
  if (!public_id) {
    return sendError(
      res,
      "public_id is required (provide as query parameter: ?public_id=...)",
      400
    );
  }
  const result = await cloudinary.uploader.destroy(decodeURIComponent(public_id));
  if (result.result === "ok")
    return sendSuccess(res, null, "Image deleted successfully");
  if (result.result === "not found")
    return sendError(res, "Image not found", 404);
  return sendError(res, "An error occurred while deleting image", 500);
});