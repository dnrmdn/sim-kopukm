import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, sk.nama_sub_kegiatan, t.tahun 
       FROM renstra_sub_kegiatan_anggaran a
       LEFT JOIN renstra_sub_kegiatan sk ON a.sub_kegiatan_id = sk.id
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
      "SELECT * FROM renstra_sub_kegiatan_anggaran WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function create(req, res, next) {
  try {
    const { sub_kegiatan_id, tahun_id, target, pagu } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_sub_kegiatan_anggaran 
      (sub_kegiatan_id, tahun_id, target, pagu) 
      VALUES (?, ?, ?, ?)`,
      [sub_kegiatan_id, tahun_id, target, pagu]
    );

    res.status(201).json({ 
      message: "Berhasil tambah anggaran sub kegiatan", 
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
    const { sub_kegiatan_id, tahun_id, target, pagu } = req.body;

    const [result] = await pool.query(
      `UPDATE renstra_sub_kegiatan_anggaran SET 
        sub_kegiatan_id = ?, 
        tahun_id = ?, 
        target = ?, 
        pagu = ? 
      WHERE id = ?`,
      [sub_kegiatan_id, tahun_id, target, pagu, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Berhasil update anggaran sub kegiatan" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM renstra_sub_kegiatan_anggaran WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    res.json({ message: "Berhasil hapus anggaran sub kegiatan" });
  } catch (err) {
    next(err);
  }
}