// backend/src/routes/pegawaiRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * GET / -> daftar pegawai (id, nama, nip, jabatan, email)
 */
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, nama, nip, jabatan, email FROM pegawai ORDER BY nama ASC");
    return res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("pegawai:list", err);
    return next(err);
  }
});

export default router;
