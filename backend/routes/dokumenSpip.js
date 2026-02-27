import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/spip";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "File kosong" });

    const name = title || file.originalname;
    const mime = file.mimetype;
    const filePath = file.path; // simpan path di DB

    const [result] = await pool.execute(
      "INSERT INTO dokumen_spip (name, mime, path) VALUES (?, ?, ?)",
      [name, mime, filePath]
    );

    res.json({
      success: true,
      data: { id: result.insertId, name, mime, path: filePath, created_at: new Date() },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
