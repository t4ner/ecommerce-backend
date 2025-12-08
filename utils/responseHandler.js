export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

export const sendError = (
  res,
  message = "An error occurred",
  statusCode = 500,
  error = null
) => {
  const response = { success: false, message };
  if (error) {
    response.error = error.message || error;
  }
  return res.status(statusCode).json(response);
};