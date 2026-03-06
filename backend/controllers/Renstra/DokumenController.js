import pool from "../../config/db.js";
import fs from "fs";

// GET ALL OR BY ID
// GET ALL
export async function get(req, res, next) {
  try {
    const { id } = req.params;
    
    if (id) {
      // Single data
      const [rows] = await pool.query(
        `SELECT d.*, u.username as nama_uploader 
         FROM renstra_dokumen d
         LEFT JOIN users u ON d.uploaded_by = u.id
         WHERE d.id = ?`, [id]
      );
      if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
      res.json(rows[0]);
    } else {
      // List data
      const [rows] = await pool.query(
        `SELECT d.*, u.username as nama_uploader 
         FROM renstra_dokumen d
         LEFT JOIN users u ON d.uploaded_by = u.id
         ORDER BY d.id DESC`
      );
      res.json(rows);
    }
  } catch (err) {
    next(err);
  }
}

// CREATE (UPLOAD)
// CREATE (UPLOAD)
export async function create(req, res, next) {
  try {
    const { nama_dokumen } = req.body;
    
    // Ambil ID dari token (middleware verifyToken)
    const userId = req.user.id; 

    if (!req.file) return res.status(400).json({ message: "File wajib diunggah" });

    // Cek duplikasi nama dokumen
    const [existing] = await pool.query(
      "SELECT id FROM renstra_dokumen WHERE nama_dokumen = ?", 
      [nama_dokumen]
    );
    
    if (existing.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Nama dokumen sudah ada!" });
    }

    // Simpan ke DB (uploaded_by diisi dengan ID user)
    const [result] = await pool.query(
      "INSERT INTO renstra_dokumen (nama_dokumen, file_path, uploaded_by) VALUES (?, ?, ?)",
      [nama_dokumen, req.file.path, userId]
    );

    res.status(201).json({ 
      message: "Berhasil upload dokumen", 
      id: result.insertId 
    });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT file_path FROM renstra_dokumen WHERE id = ?", [id]);
    
    if (rows.length > 0 && fs.existsSync(rows[0].file_path)) {
      fs.unlinkSync(rows[0].file_path);
    }

    const [result] = await pool.query("DELETE FROM renstra_dokumen WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    res.json({ message: "Berhasil hapus dokumen" });
  } catch (err) {
    next(err);
  }
}