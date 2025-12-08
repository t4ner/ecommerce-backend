export const validateCategory = (req, res, next) => {
  const { name, slug } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push("Category name is required");
  if (!slug || !slug.trim()) errors.push("Slug is required");
  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    errors.push("Slug may contain only lowercase letters, numbers, and hyphens");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }
  next();
};