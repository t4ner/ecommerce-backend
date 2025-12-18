import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Kullanıcının sepetini getir
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name slug price images stock isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Toplam fiyatı hesapla
  let total = 0;
  cart.items.forEach((item) => {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  });

  return sendSuccess(
    res,
    {
      cart,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    },
    "Cart fetched successfully"
  );
});

/**
 * Sepete ürün ekle
 */
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return sendError(res, "Product ID is required", 400);
  }

  if (quantity < 1) {
    return sendError(res, "Quantity must be at least 1", 400);
  }

  // Ürünü kontrol et
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  if (!product.isActive) {
    return sendError(res, "Product is not active", 400);
  }

  // Sepeti bul veya oluştur
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Ürün sepette var mı kontrol et
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Ürün sepette varsa miktarı artır
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    // Stok kontrolü
    if (newQuantity > product.stock) {
      return sendError(
        res,
        `Insufficient stock. Available: ${product.stock}`,
        400
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Ürün sepette yoksa ekle
    // Stok kontrolü
    if (quantity > product.stock) {
      return sendError(
        res,
        `Insufficient stock. Available: ${product.stock}`,
        400
      );
    }

    cart.items.push({
      product: productId,
      quantity: quantity,
    });
  }

  await cart.save();

  // Populate ile güncel sepeti getir
  await cart.populate({
    path: "items.product",
    select: "name slug price images stock isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  // Toplam fiyatı hesapla
  let total = 0;
  cart.items.forEach((item) => {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  });

  return sendSuccess(
    res,
    {
      cart,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    },
    "Product added to cart successfully"
  );
});

/**
 * Sepetteki ürün miktarını güncelle
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return sendError(res, "Quantity must be at least 1", 400);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return sendError(res, "Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return sendError(res, "Product not found in cart", 404);
  }

  // Ürün bilgilerini al
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  // Stok kontrolü
  if (quantity > product.stock) {
    return sendError(
      res,
      `Insufficient stock. Available: ${product.stock}`,
      400
    );
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // Populate ile güncel sepeti getir
  await cart.populate({
    path: "items.product",
    select: "name slug price images stock isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  // Toplam fiyatı hesapla
  let total = 0;
  cart.items.forEach((item) => {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  });

  return sendSuccess(
    res,
    {
      cart,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    },
    "Cart item updated successfully"
  );
});

/**
 * Sepetten ürün sil
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return sendError(res, "Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return sendError(res, "Product not found in cart", 404);
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate ile güncel sepeti getir
  await cart.populate({
    path: "items.product",
    select: "name slug price images stock isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  // Toplam fiyatı hesapla
  let total = 0;
  cart.items.forEach((item) => {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  });

  return sendSuccess(
    res,
    {
      cart,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    },
    "Product removed from cart successfully"
  );
});

/**
 * Sepeti temizle
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return sendError(res, "Cart not found", 404);
  }

  cart.items = [];
  await cart.save();

  return sendSuccess(
    res,
    {
      cart,
      total: "0.00",
      itemCount: 0,
    },
    "Cart cleared successfully"
  );
});

