import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const router = express.Router();

// ── Storage: save to /uploads/lhp/ ──────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads", "lhp");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ── GET all ─────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, nama_dokumen, nama_file, mime_type, ukuran_file, tahun, instansi, uploaded_by, created_at, updated_at FROM dokumen_lhp ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error("GET /api/lhp error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST upload ──────────────────────────────────────────────────────────────
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "File kosong" });

    // ✅ Destructure FIRST, then validate
    const { title, tahun, instansi } = req.body;
    if (!tahun) return res.status(400).json({ success: false, message: "Tahun wajib diisi" });

    const nama_dokumen = title || file.originalname;
    const nama_file    = file.filename;
    const mime_type    = file.mimetype;
    const ukuran_file  = file.size;

    const [result] = await pool.execute(
      `INSERT INTO dokumen_lhp (nama_dokumen, nama_file, mime_type, ukuran_file, tahun, instansi)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_dokumen, nama_file, mime_type, ukuran_file, tahun, instansi || null]
    );

    const [rows] = await pool.execute(
      "SELECT id, nama_dokumen, nama_file, mime_type, ukuran_file, tahun, instansi, created_at FROM dokumen_lhp WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (e) {
    console.error("POST /api/lhp/upload error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── GET preview/download ─────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: "File tidak ditemukan" });

    const file     = rows[0];
    const filePath = path.join(uploadDir, file.nama_file);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ success: false, message: "File fisik tidak ditemukan" });

    res.setHeader("Content-Type", file.mime_type);
    res.setHeader("Content-Disposition", `inline; filename="${file.nama_dokumen}"`);
    res.sendFile(filePath);
  } catch (e) {
    console.error("GET /api/lhp/:id error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── PUT rename ───────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Nama kosong" });

    await pool.execute(
      "UPDATE dokumen_lhp SET nama_dokumen = ? WHERE id = ?",
      [name.trim(), req.params.id]
    );

    const [rows] = await pool.execute(
      "SELECT id, nama_dokumen, nama_file, mime_type, ukuran_file, tahun, instansi, created_at, updated_at FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    console.error("PUT /api/lhp/:id error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT nama_file FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });

    // delete physical file
    const filePath = path.join(uploadDir, rows[0].nama_file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.execute("DELETE FROM dokumen_lhp WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (e) {
    console.error("DELETE /api/lhp/:id error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;