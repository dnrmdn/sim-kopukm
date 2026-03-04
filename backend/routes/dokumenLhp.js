import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const router = express.Router();

/* ================== UPLOAD DIR ================== */
const uploadDir = path.join(process.cwd(), "uploads", "lhp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================== MULTER ================== */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

/* ================== GET LIST ================== */
// GET /api/lhp
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nama_dokumen AS name,
        nama_file,
        mime_type AS mime,
        tahun,
        created_at
      FROM dokumen_lhp
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil data LHP" });
  }
});

/* ================== UPLOAD ================== */
// POST /api/lhp/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tahun } = req.body;
    const file = req.file;

    if (!file)
      return res.status(400).json({ success: false, message: "File kosong" });

    const namaDokumen = title || file.originalname;

    const [result] = await pool.query(
      `
      INSERT INTO dokumen_lhp
      (nama_dokumen, nama_file, mime_type, ukuran_file, tahun)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        namaDokumen,
        file.filename,
        file.mimetype,
        file.size,
        tahun || new Date().getFullYear(),
      ]
    );

    res.json({
      success: true,
      data: {
        id: result.insertId,
        name: namaDokumen,
        mime: file.mimetype,
        created_at: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload LHP gagal" });
  }
});

/* ================== PREVIEW ================== */
// GET /api/lhp/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );

    if (!rows[0]) return res.sendStatus(404);

    const filePath = path.join(uploadDir, rows[0].nama_file);
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/* ================== UPDATE ================== */
// PUT /api/lhp/:id
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Nama kosong" });

    await pool.query(
      "UPDATE dokumen_lhp SET nama_dokumen = ? WHERE id = ?",
      [name, req.params.id]
    );

    const [rows] = await pool.query(
      "SELECT id, nama_dokumen AS name, mime_type AS mime, created_at FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================== DELETE ================== */
// DELETE /api/lhp/:id
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT nama_file FROM dokumen_lhp WHERE id = ?",
      [req.params.id]
    );

    if (rows[0]) {
      const filePath = path.join(uploadDir, rows[0].nama_file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query("DELETE FROM dokumen_lhp WHERE id = ?", [req.params.id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;