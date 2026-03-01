import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * 📋 GET / -> Ambil semua relasi hirarki
 */
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ph.id,
        ph.id_pegawai,
        p.nama AS nama_pegawai,
        ph.id_atasan,
        a.nama AS nama_atasan,
        ph.valid_dari,
        ph.valid_sampai
      FROM pegawai_hirarki ph
      LEFT JOIN pegawai p ON ph.id_pegawai = p.id
      LEFT JOIN pegawai a ON ph.id_atasan = a.id
      ORDER BY p.nama ASC
    `);

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("hirarki:list", err);
    return next(err);
  }
});

/**
 * 🔍 GET /:id -> Ambil satu hirarki
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM pegawai_hirarki WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("hirarki:getById", err);
    return next(err);
  }
});

/**
 * ➕ POST / -> Tambah relasi hirarki
 */
router.post("/", async (req, res, next) => {
  try {
    const { id_pegawai, id_atasan, valid_dari, valid_sampai } = req.body;

    // Validasi tidak boleh jadi atasan diri sendiri
    if (id_pegawai === id_atasan) {
      return res.status(400).json({
        success: false,
        message: "Pegawai tidak boleh menjadi atasan dirinya sendiri",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO pegawai_hirarki 
      (id_pegawai, id_atasan, valid_dari, valid_sampai)
      VALUES (?, ?, ?, ?)`,
      [id_pegawai, id_atasan || null, valid_dari || null, valid_sampai || null]
    );

    return res.status(201).json({
      success: true,
      message: "Relasi hirarki berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (err) {
    console.error("hirarki:create", err);
    return next(err);
  }
});

/**
 * ✏️ PUT /:id -> Update relasi hirarki
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_pegawai, id_atasan, valid_dari, valid_sampai } = req.body;

    if (id_pegawai === id_atasan) {
      return res.status(400).json({
        success: false,
        message: "Pegawai tidak boleh menjadi atasan dirinya sendiri",
      });
    }

    const [result] = await pool.query(
      `UPDATE pegawai_hirarki 
       SET id_pegawai = ?, 
           id_atasan = ?, 
           valid_dari = ?, 
           valid_sampai = ?
       WHERE id = ?`,
      [id_pegawai, id_atasan || null, valid_dari || null, valid_sampai || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      message: "Relasi hirarki berhasil diperbarui",
    });
  } catch (err) {
    console.error("hirarki:update", err);
    return next(err);
  }
});

/**
 * 🗑️ DELETE /:id -> Hapus relasi hirarki
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM pegawai_hirarki WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      message: "Relasi hirarki berhasil dihapus",
    });
  } catch (err) {
    console.error("hirarki:delete", err);
    return next(err);
  }
});

export default router;