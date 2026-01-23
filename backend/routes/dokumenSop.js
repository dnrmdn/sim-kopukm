import express from "express";
import multer from "multer";
import pool from "../config/db.js";

const router = express.Router();

/* =========================
   MULTER (MEMORY STORAGE)
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   UPLOAD DOKUMEN SOP
   POST /api/dokumen/sop/upload
========================= */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File kosong",
      });
    }

    const name = title || file.originalname;
    const mime = file.mimetype;
    const data = file.buffer;

    const [result] = await pool.execute(
      "INSERT INTO dokumen_sop (name, mime, data) VALUES (?, ?, ?)",
      [name, mime, data]
    );

    res.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        mime,
        created_at: new Date(),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   LIST DOKUMEN SOP
   GET /api/dokumen/sop
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_sop ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

/* =========================
   PREVIEW / DOWNLOAD SOP
   GET /api/dokumen/sop/:id
========================= */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await pool.execute(
      "SELECT * FROM dokumen_sop WHERE id = ?",
      [id]
    );

    if (!rows[0]) {
      return res.status(404).send("File tidak ditemukan");
    }

    const file = rows[0];
    res.setHeader("Content-Type", file.mime);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.name}"`
    );
    res.send(file.data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

/* =========================
   HAPUS DOKUMEN SOP
   DELETE /api/dokumen/sop/:id
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await pool.execute(
      "DELETE FROM dokumen_sop WHERE id = ?",
      [id]
    );

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

/* =========================
   EDIT NAMA DOKUMEN SOP
   PUT /api/dokumen/sop/:id
========================= */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama kosong",
      });
    }

    await pool.execute(
      "UPDATE dokumen_sop SET name = ? WHERE id = ?",
      [name, id]
    );

    const [rows] = await pool.execute(
      "SELECT id, name, mime, created_at FROM dokumen_sop WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

export default router;
