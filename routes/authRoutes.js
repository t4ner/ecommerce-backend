import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getUsers,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

// Protected routes
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/users", protect, getUsers);

export default router;
