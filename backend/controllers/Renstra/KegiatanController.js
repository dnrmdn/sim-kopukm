import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    // Kita gunakan JOIN jika ingin menarik nama_program sekaligus
    const [rows] = await pool.query(
      `SELECT k.*, p.nama_program 
       FROM renstra_kegiatan k
       LEFT JOIN renstra_program p ON k.program_id = p.id
       ORDER BY k.id DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET BY ID
export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM renstra_kegiatan WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data kegiatan tidak ditemukan" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function create(req, res, next) {
  try {
    const { 
      program_id, 
      kodering, 
      nama_kegiatan, 
      indikator, 
      satuan 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_kegiatan 
      (program_id, kodering, nama_kegiatan, indikator, satuan) 
      VALUES (?, ?, ?, ?, ?)`,
      [program_id, kodering, nama_kegiatan, indikator, satuan]
    );

    res.status(201).json({ 
      message: "Berhasil tambah data kegiatan", 
      id: result.insertId 
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE
export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { 
      program_id, 
      kodering, 
      nama_kegiatan, 
      indikator, 
      satuan 
    } = req.body;

    const [result] = await pool.query(
      `UPDATE renstra_kegiatan SET 
        program_id = ?, 
        kodering = ?, 
        nama_kegiatan = ?, 
        indikator = ?, 
        satuan = ? 
      WHERE id = ?`,
      [program_id, kodering, nama_kegiatan, indikator, satuan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gagal update, ID kegiatan tidak ditemukan" });
    }

    res.json({ message: "Berhasil update data kegiatan" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM renstra_kegiatan WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gagal hapus, ID kegiatan tidak ditemukan" });
    }

    res.json({ message: "Berhasil hapus data kegiatan" });
  } catch (err) {
    next(err);
  }
}