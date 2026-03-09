import express from "express";
import multer from "multer";
import pool from "../config/db.js";

const router = express.Router();

const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

/**
 * GET LIST DOKUMEN LAKIP
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, mime, triwulan, tahun, created_at FROM dokumen_lakip ORDER BY id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil data" });
  }
});

/**
 * UPLOAD DOKUMEN LAKIP
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File wajib diisi" });
    }

    const { title, triwulan, tahun } = req.body;

    if (!triwulan) return res.status(400).json({ success: false, message: "Triwulan wajib dipilih" });
    if (!tahun)    return res.status(400).json({ success: false, message: "Tahun wajib diisi" });

    const name = title || req.file.originalname;
    const mime = req.file.mimetype;
    const data = req.file.buffer;

    const [result] = await pool.query(
      "INSERT INTO dokumen_lakip (name, mime, data, triwulan, tahun) VALUES (?, ?, ?, ?, ?)",
      [name, mime, data, triwulan, tahun]
    );

    res.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        mime,
        triwulan,
        tahun,
        created_at: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload gagal" });
  }
});

/**
 * UPDATE NAMA DOKUMEN
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: "Nama tidak boleh kosong" });
  }

  await pool.query("UPDATE dokumen_lakip SET name = ? WHERE id = ?", [name.trim(), id]);

  const [[row]] = await pool.query(
    "SELECT id, name, mime, triwulan, tahun, created_at FROM dokumen_lakip WHERE id = ?",
    [id]
  );

  res.json({ success: true, data: row });
});

/**
 * DELETE DOKUMEN
 */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM dokumen_lakip WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

/**
 * PREVIEW / DOWNLOAD FILE
 */
router.get("/:id", async (req, res) => {
  const [[file]] = await pool.query(
    "SELECT * FROM dokumen_lakip WHERE id = ?",
    [req.params.id]
  );

  if (!file) return res.sendStatus(404);

  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", file.mime);
  res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
  res.send(file.data);
});

export default router;