import User from "../models/user.js";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
};

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });

    const user = await User.create({ name, email, password });

    // Tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions).json({
      success: true,
      message: "Kayıt başarılı",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Hatalı giriş" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Hatalı giriş" });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions).json({
      success: true,
      message: "Giriş başarılı",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Çıkış yapıldı" });
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      return res.status(500).json({
        message: "JWT_REFRESH_SECRET environment variable is not defined",
      });
    }

    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Token bulunamadı" });

    const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      data.id
    );

    res.cookie("refreshToken", newRefreshToken, cookieOptions).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

// GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";

    // Search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Get all users
    const users = await User.find(searchFilter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
