// backend/src/routes/renstraSatuansRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * GET / -> distinct satuan yang terkait dengan programs => via kegiatans -> subkegiatans
 *
 * Returns: [{ id: <auto>, name: "Unit" }, ... ]
 */
router.get("/", async (req, res, next) => {
  try {
    // Ambil distinct satuan yang berelasi ke programs via kegiatans -> subkegiatans
    // Query memastikan hanya mengambil satuan yang tidak kosong/null.
    const sql = `
      SELECT DISTINCT TRIM(sk.satuan) AS name
      FROM subkegiatans sk
      JOIN kegiatans k ON k.id = sk.kegiatan_id
      JOIN programs p ON p.id = k.program_id
      WHERE COALESCE(TRIM(sk.satuan), '') <> ''
      ORDER BY name ASC
    `;
    const [rows] = await pool.query(sql);

    // Normalize ke bentuk { id, name }
    const result = (rows || []).map((r, i) => ({ id: i + 1, name: r.name }));
    return res.json(result);
  } catch (err) {
    console.error("renstra:satuans:list", err);
    return next(err);
  }
});

export default router;
