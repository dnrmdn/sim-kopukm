// routes/userProfile.js  — PUT /api/user/profile
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const router = express.Router();

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Format tidak didukung. Gunakan JPG, PNG, atau WebP."));
  },
});

// ── PUT /profile ──────────────────────────────────────────────────────────────
router.put("/profile", upload.single("avatar"), async (req, res) => {
  console.log("=== DEBUG PROFILE ===");
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  console.log("userId:", req.user?.id);
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Tidak terautentikasi" });

    const { name, nip, username } = req.body;
    if (nip?.trim()) {
      if (!/^\d+$/.test(nip.trim())) return res.status(400).json({ success: false, message: "NIP hanya boleh berisi angka" });
      if (nip.trim().length !== 18) return res.status(400).json({ success: false, message: `NIP harus tepat 18 digit (sekarang ${nip.trim().length} digit)` });
    }

    // cek username unik
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ? AND id != ?", [username.trim(), userId]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: "Username sudah digunakan" });

    // avatar baru
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `uploads/avatars/${req.file.filename}`;
      // hapus avatar lama dari disk
      const [rows] = await pool.query("SELECT avatar FROM users WHERE id = ?", [userId]);
      const old = rows[0]?.avatar;
      if (old?.startsWith("uploads/")) {
        const oldPath = path.join(process.cwd(), old);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    // UPDATE
    const fields = ["name = ?", "nip = ?", "username = ?", "updated_at = NOW()"];
    const values = [name.trim(), nip?.trim() || null, username.trim()];
    if (avatarUrl) {
      fields.push("avatar = ?");
      values.push(avatarUrl);
    }
    values.push(userId);

    await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);

    // kembalikan data terbaru
    const [rows] = await pool.query("SELECT id, name, nip, username, avatar, created_at, updated_at FROM users WHERE id = ?", [userId]);
    const user = rows[0];
    if (user.avatar?.startsWith("uploads/")) user.avatar = `${req.protocol}://${req.get("host")}/${user.avatar}`;

    return res.json({ success: true, message: "Profil berhasil diperbarui", data: user });
  } catch (err) {
    console.error("Profile update error:", err);
    if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ success: false, message: "Ukuran foto maksimal 2 MB" });
    return res.status(500).json({ success: false, message: err.message || "Terjadi kesalahan server" });
  }
});

export default router;
