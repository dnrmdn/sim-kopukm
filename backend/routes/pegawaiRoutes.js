import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * 📋 GET / -> Fetch all pegawai with nama_jabatan
 */
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pegawai,
        p.nama_lengkap,
        p.nip,
        p.jabatan_definitif,
        j.nama_jabatan,
        p.level,
        ph.id_atasan
      FROM pegawai p
      LEFT JOIN jabatan j 
        ON p.jabatan_definitif = j.id_jabatan
      LEFT JOIN pegawai_hirarki ph 
        ON p.id_pegawai = ph.id_pegawai
      ORDER BY p.nama_lengkap ASC
    `);

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("pegawai:list", err);
    return next(err);
  }
});

/**
 * ➕ POST / -> Create new pegawai
 */
router.post("/", async (req, res, next) => {
  const { nama_lengkap, nip, jabatan_definitif, level } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO pegawai (nama_lengkap, nip, jabatan_definitif, level) VALUES (?, ?, ?, ?)",
      [nama_lengkap, nip, jabatan_definitif || null, level || 0]
    );
    return res.status(201).json({ 
      success: true, 
      message: "Pegawai berhasil ditambahkan",
      id: result.insertId 
    });
  } catch (err) {
    console.error("pegawai:create", err);
    return next(err);
  }
});

/**
 * ✏️ PUT /:id -> Update pegawai
 */
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { nama_lengkap, nip, jabatan_definitif, level } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE pegawai SET nama_lengkap = ?, nip = ?, jabatan_definitif = ?, level = ? WHERE id_pegawai = ?",
      [nama_lengkap, nip, jabatan_definitif || null, level || 0, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pegawai tidak ditemukan" });
    }

    return res.json({ success: true, message: "Data pegawai berhasil diperbarui" });
  } catch (err) {
    console.error("pegawai:update", err);
    return next(err);
  }
});

/**
 * 🗑️ DELETE /:id -> Delete pegawai
 */
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM pegawai WHERE id_pegawai = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pegawai tidak ditemukan" });
    }

    return res.json({ success: true, message: "Pegawai berhasil dihapus" });
  } catch (err) {
    console.error("pegawai:delete", err);
    return next(err);
  }
});

export default router;