import User from "../models/user.js";
import { generateTokens } from "../utils/generateTokens.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Cookie options - environment'a göre ayarla
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Sadece production'da secure
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, "Tüm alanlar zorunludur", 400);
  }

  // Email format kontrolü
  if (!emailRegex.test(email)) {
    return sendError(res, "Geçerli bir email adresi giriniz", 400);
  }

  // Şifre güçlülük kontrolü
  if (password.length < 6) {
    return sendError(res, "Şifre en az 6 karakter olmalıdır", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return sendError(res, "Bu email zaten kayıtlı", 400);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return sendSuccess(
    res,
    {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    "Kayıt başarılı",
    201
  );
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email ve şifre gereklidir", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );
  if (!user) {
    return sendError(res, "Hatalı email veya şifre", 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, "Hatalı email veya şifre", 400);
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return sendSuccess(
    res,
    {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    "Giriş başarılı"
  );
});

// LOGOUT
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  return sendSuccess(res, null, "Çıkış yapıldı");
});

// REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    return sendError(
      res,
      "JWT_REFRESH_SECRET environment variable is not defined",
      500
    );
  }

  const token = req.cookies.refreshToken;
  if (!token) {
    return sendError(res, "Token bulunamadı", 401);
  }

  try {
    const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      data.id
    );

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    return sendSuccess(res, { accessToken }, "Token yenilendi");
  } catch (err) {
    return sendError(res, "Geçersiz token", 401);
  }
});

// GET ALL USERS
export const getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || "";

  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchFilter)
    .select("-password")
    .sort({ createdAt: -1 });

  return sendSuccess(res, users, "Kullanıcılar başarıyla getirildi");
});
