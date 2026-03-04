// backend/src/routes/dokumenKak.js
import express from "express";
import multer from "multer";
import pool from "../config/db.js";

const router = express.Router();

// ================== MULTER (MEMORY) ==================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ================== LIST DOKUMEN ==================
router.get("/", async (req, res) => {
  try {
    // Disable cache supaya frontend selalu dapat data terbaru
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_kak ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil data" });
  }
});

// ================== UPLOAD ==================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "File kosong" });
    }

    const name = title?.trim() || file.originalname;

    // Insert ke DB
    const [result] = await pool.execute(
      "INSERT INTO dokumen_kak (name, mime, data) VALUES (?, ?, ?)",
      [name, file.mimetype, file.buffer]
    );

    // Ambil data terbaru dari DB (termasuk created_at)
    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_kak WHERE id = ?",
      [result.insertId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload gagal" });
  }
});

// ================== PREVIEW / DOWNLOAD ==================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT name, mime, data FROM dokumen_kak WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).send("File tidak ditemukan");
    }

    const file = rows[0];
    res.setHeader("Content-Type", file.mime);
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal membuka file");
  }
});

// ================== UPDATE NAMA ==================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Nama tidak boleh kosong" });
    }

    await pool.execute("UPDATE dokumen_kak SET name = ? WHERE id = ?", [name, id]);

    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_kak WHERE id = ?",
      [id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal update" });
  }
});

// ================== DELETE ==================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM dokumen_kak WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal hapus" });
  }
});

export default router;