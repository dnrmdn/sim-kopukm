import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUser,
  getCurrentUser,
} from "../controllers/authController.js";

import {
  verifyToken,
  isAdmin,
  isSuperAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔐 Auth Routes (Public)
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

/**
 * 👥 User Management (Protected)
 */
router.get("/me", verifyToken, getCurrentUser);
router.get("/users", verifyToken, isAdmin, getAllUsers); // hanya admin/super_admin
router.put("/users/:id/role", verifyToken, isSuperAdmin, updateUserRole); // hanya super_admin
router.put("/users/:id", verifyToken, updateUser); // user update profil sendiri
router.delete("/users/:id", verifyToken, isSuperAdmin, deleteUser); // hanya super_admin

/**
 * 🧑‍💼 Contoh route role-based access (demo)
 */
router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ success: true, message: `Halo Admin ${req.user.username}` });
});

export default router;
