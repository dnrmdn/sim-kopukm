import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, k.nama_kegiatan, t.tahun 
       FROM renstra_kegiatan_anggaran a
       LEFT JOIN renstra_kegiatan k ON a.kegiatan_id = k.id
       LEFT JOIN renstra_tahun t ON a.tahun_id = t.id
       ORDER BY a.id DESC`
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
      "SELECT * FROM renstra_kegiatan_anggaran WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Data anggaran tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function create(req, res, next) {
  try {
    const { kegiatan_id, tahun_id, target, pagu } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_kegiatan_anggaran 
      (kegiatan_id, tahun_id, target, pagu) 
      VALUES (?, ?, ?, ?)`,
      [kegiatan_id, tahun_id, target, pagu]
    );

    res.status(201).json({ 
      message: "Berhasil tambah data anggaran kegiatan", 
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
    const { kegiatan_id, tahun_id, target, pagu } = req.body;

    const [result] = await pool.query(
      `UPDATE renstra_kegiatan_anggaran SET 
        kegiatan_id = ?, 
        tahun_id = ?, 
        target = ?, 
        pagu = ? 
      WHERE id = ?`,
      [kegiatan_id, tahun_id, target, pagu, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Berhasil update data anggaran kegiatan" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM renstra_kegiatan_anggaran WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    res.json({ message: "Berhasil hapus data anggaran kegiatan" });
  } catch (err) {
    next(err);
  }
}