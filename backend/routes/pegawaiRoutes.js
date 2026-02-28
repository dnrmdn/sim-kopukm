import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * 📋 GET / -> Fetch all pegawai (getAllPegawai)
 */
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nama, nip, jabatan, email FROM pegawai ORDER BY nama ASC"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("pegawai:list", err);
    return next(err);
  }
});

/**
 * ➕ POST / -> Create new pegawai (createPegawai)
 */
router.post("/", async (req, res, next) => {
  const { nama, nip, jabatan, email } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO pegawai (nama, nip, jabatan, email) VALUES (?, ?, ?, ?)",
      [nama, nip, jabatan, email]
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
 * ✏️ PUT /:id -> Update pegawai (editPegawai)
 */
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { nama, nip, jabatan, email } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE pegawai SET nama = ?, nip = ?, jabatan = ?, email = ? WHERE id = ?",
      [nama, nip, jabatan, email, id]
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
 * 🗑️ DELETE /:id -> Delete pegawai (deletePegawai)
 */
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM pegawai WHERE id = ?", [id]);
    
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