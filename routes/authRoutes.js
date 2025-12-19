import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getUsers,
  adminLogin,
} from "../controllers/authController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

// Protected routes
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/users", protect, admin, getUsers);

export default router;
