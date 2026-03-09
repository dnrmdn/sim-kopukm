import pool from "../config/db.js";

/**
 * 📋 GET ALL JABATAN
 */
export const getAllJabatan = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jabatan ORDER BY level ASC, nama_jabatan ASC");
    res.json({ 
      success: true, 
      count: rows.length, 
      data: rows 
    });
  } catch (error) {
    console.error("Get Jabatan Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🔍 GET JABATAN BY ID
 */
export const getJabatanById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM jabatan WHERE id_jabatan = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Jabatan tidak ditemukan" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get Jabatan By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ➕ CREATE JABATAN
 */
export const createJabatan = async (req, res) => {
  try {
    const { nama_jabatan, level } = req.body;

    if (!nama_jabatan) {
      return res.status(400).json({ success: false, message: "Nama jabatan wajib diisi" });
    }

    if (!level) {
      return res.status(400).json({ success: false, message: "Level jabatan wajib dipilih" });
    }

    // Cek apakah nama jabatan sudah ada (opsional, untuk menghindari duplikat)
    const [existing] = await pool.query(
      "SELECT * FROM jabatan WHERE nama_jabatan = ? AND level = ?", 
      [nama_jabatan, level]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Nama jabatan dengan level tersebut sudah terdaftar" });
    }

    const [result] = await pool.query(
      "INSERT INTO jabatan (nama_jabatan, level) VALUES (?, ?)",
      [nama_jabatan, level]
    );

    res.status(201).json({
      success: true,
      message: "Jabatan berhasil ditambahkan",
      data: { id: result.insertId, nama_jabatan, level }
    });
  } catch (error) {
    console.error("Create Jabatan Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ✏️ UPDATE JABATAN
 */
export const updateJabatan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_jabatan, level } = req.body;

    if (!nama_jabatan) {
      return res.status(400).json({ success: false, message: "Nama jabatan wajib diisi" });
    }

    if (!level) {
      return res.status(400).json({ success: false, message: "Level jabatan wajib dipilih" });
    }

    const [result] = await pool.query(
      "UPDATE jabatan SET nama_jabatan = ?, level = ? WHERE id_jabatan = ?",
      [nama_jabatan, level, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Jabatan tidak ditemukan" });
    }

    res.json({ success: true, message: "Jabatan berhasil diperbarui" });
  } catch (error) {
    console.error("Update Jabatan Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 🗑️ DELETE JABATAN
 */
export const deleteJabatan = async (req, res) => {
  try {
    const { id } = req.params;

    // Catatan: Jika jabatan ini sedang dipakai di tabel pegawai, 
    // pastikan handle constraint error (RESTRICT) di database.
    const [result] = await pool.query("DELETE FROM jabatan WHERE id_jabatan = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Jabatan tidak ditemukan" });
    }

    res.json({ success: true, message: "Jabatan berhasil dihapus" });
  } catch (error) {
    console.error("Delete Jabatan Error:", error);
    
    // Memberi pesan lebih spesifik jika data masih digunakan oleh tabel lain
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ 
            success: false, 
            message: "Gagal menghapus: Jabatan masih digunakan oleh data pegawai." 
        });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};