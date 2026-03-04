// backend/src/routes/skmRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET /api/skm/dashboard
router.get("/dashboard", async (req, res, next) => {
  try {
    const { tahun } = req.query;

    const [layanan] = await pool.query(
      `
      SELECT 
        nama_layanan,
        COUNT(*) AS jumlah_responden,
        ROUND(AVG(nilai), 2) AS nilai_rata
      FROM skm
      WHERE tahun = ?
      GROUP BY nama_layanan
      ORDER BY nama_layanan
      `,
      [tahun]
    );

    const [stat] = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_responden,
        ROUND(AVG(nilai), 2) AS indeks_kepuasan
      FROM skm
      WHERE tahun = ?
      `,
      [tahun]
    );

    res.json({
      layanan,
      statistik: stat[0],
    });
  } catch (err) {
    console.error("SKM dashboard error:", err);
    next(err);
  }
});

// POST /api/skm
router.post("/", async (req, res, next) => {
  try {
    const { nama_layanan, nilai, tahun } = req.body;

    if (!nama_layanan || !nilai || !tahun) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await pool.query(
      `INSERT INTO skm (nama_layanan, nilai, tahun) VALUES (?, ?, ?)`,
      [nama_layanan, nilai, tahun]
    );

    res.json({ message: "Survey SKM berhasil disimpan" });
  } catch (err) {
    console.error("SKM create error:", err);
    next(err);
  }
});

export default router; // ✅ INI YANG TADI HILANG