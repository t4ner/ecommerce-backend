/**
 * Async Handler Utility
 *
 * Async fonksiyonlardaki hataları otomatik olarak yakalamak için kullanılır.
 * Her controller fonksiyonunu try-catch ile sarmalamak yerine,
 * bu wrapper'ı kullanarak daha temiz kod yazabiliriz.
 *
 * Kullanım:
 * router.get("/", asyncHandler(async (req, res) => {
 *   // kod buraya
 * }));
 */

/**
 * Async fonksiyonları wrap eder ve hataları yakalar
 * @param {Function} fn - Async fonksiyon
 * @returns {Function} - Wrapped fonksiyon
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
