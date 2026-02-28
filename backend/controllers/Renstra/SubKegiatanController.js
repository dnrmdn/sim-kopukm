import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT sk.*, k.nama_kegiatan 
       FROM renstra_sub_kegiatan sk
       LEFT JOIN renstra_kegiatan k ON sk.kegiatan_id = k.id
       ORDER BY sk.id DESC`
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
      "SELECT * FROM renstra_sub_kegiatan WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Sub Kegiatan tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function create(req, res, next) {
  try {
    const { 
      kegiatan_id, 
      kodering, 
      nama_sub_kegiatan, 
      output_sub, 
      indikator, 
      satuan, 
      keterangan 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_sub_kegiatan 
      (kegiatan_id, kodering, nama_sub_kegiatan, output_sub, indikator, satuan, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kegiatan_id, kodering, nama_sub_kegiatan, output_sub, indikator, satuan, keterangan]
    );

    res.status(201).json({ 
      message: "Berhasil tambah sub kegiatan", 
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
      kegiatan_id, 
      kodering, 
      nama_sub_kegiatan, 
      output_sub, 
      indikator, 
      satuan, 
      keterangan 
    } = req.body;

    const [result] = await pool.query(
      `UPDATE renstra_sub_kegiatan SET 
        kegiatan_id = ?, 
        kodering = ?, 
        nama_sub_kegiatan = ?, 
        output_sub = ?, 
        indikator = ?, 
        satuan = ?, 
        keterangan = ? 
      WHERE id = ?`,
      [kegiatan_id, kodering, nama_sub_kegiatan, output_sub, indikator, satuan, keterangan, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Berhasil update sub kegiatan" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM renstra_sub_kegiatan WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    res.json({ message: "Berhasil hapus sub kegiatan" });
  } catch (err) {
    next(err);
  }
}