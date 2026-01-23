import express from "express";
import multer from "multer";
import pool from "../config/db.js";

const router = express.Router();

// multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Upload dokumen SPIP =====
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "File kosong" });

    const name = title || file.originalname;
    const mime = file.mimetype;
    const data = file.buffer;

    const [result] = await pool.execute(
      "INSERT INTO dokumen_spip (name, mime, data) VALUES (?, ?, ?)",
      [name, mime, data]
    );

    res.json({
      success: true,
      data: { id: result.insertId, name, mime, created_at: new Date() },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== List dokumen SPIP =====
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_spip ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

// ===== Preview/download dokumen SPIP =====
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.execute("SELECT * FROM dokumen_spip WHERE id = ?", [id]);
    if (!rows[0]) return res.status(404).json({ status: "error", message: "File tidak ditemukan" });

    const file = rows[0];
    res.setHeader("Content-Type", file.mime);
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    res.send(file.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// ===== Hapus dokumen SPIP =====
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.execute("DELETE FROM dokumen_spip WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

// ===== Edit nama dokumen SPIP =====
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Nama kosong" });

    await pool.execute("UPDATE dokumen_spip SET name = ? WHERE id = ?", [name, id]);
    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_spip WHERE id = ?",
      [id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

export default router;
