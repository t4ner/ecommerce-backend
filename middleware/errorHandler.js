import { sendError } from "../utils/responseHandler.js";

// Global error handler
export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation error", errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "Field";
    return res
      .status(400)
      .json({ success: false, message: `${field} already exists` });
  }
  if (err.name === "CastError") {
    return sendError(res, "Invalid ID format", 400);
  }
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE")
      return sendError(res, "File size is too large (max 5MB)", 400);
    if (err.code === "LIMIT_FILE_COUNT")
      return sendError(res, "Too many files uploaded", 400);
    return sendError(res, "File upload error", 400);
  }
  if (err.http_code) {
    return sendError(res, "Image upload service error", 500, err);
  }

  console.error("❌ Error:", err);

  return sendError(
    res,
    err.message || "Server error",
    err.statusCode || 500,
    err
  );
};

// 404 Not Found
export const notFoundHandler = (req, res) =>
  res
    .status(404)
    .json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
