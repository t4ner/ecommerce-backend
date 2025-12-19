import jwt from "jsonwebtoken";
import User from "../models/user.js";
import "dotenv/config";

export const protect = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET environment variable is not defined" });
    }

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer"))
      return res.status(401).json({ message: "Yetkisiz erişim" });

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token doğrulanamadı" });
  }
};

export const admin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Önce giriş yapmalısınız" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin yetkisi gerekli" });
  }

  next();
};
