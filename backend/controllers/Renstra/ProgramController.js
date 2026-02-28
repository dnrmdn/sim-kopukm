import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM renstra_program ORDER BY id DESC"
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
      "SELECT * FROM renstra_program WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
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
      kodering, 
      nama_program, 
      output_program, 
      indikator_program, 
      satuan 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_program 
      (kodering, nama_program, output_program, indikator_program, satuan) 
      VALUES (?, ?, ?, ?, ?)`,
      [kodering, nama_program, output_program, indikator_program, satuan]
    );

    res.status(201).json({ 
      message: "Berhasil tambah data program", 
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
      kodering, 
      nama_program, 
      output_program, 
      indikator_program, 
      satuan 
    } = req.body;

    const [result] = await pool.query(
      `UPDATE renstra_program SET 
        kodering = ?, 
        nama_program = ?, 
        output_program = ?, 
        indikator_program = ?, 
        satuan = ? 
      WHERE id = ?`,
      [kodering, nama_program, output_program, indikator_program, satuan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data gagal diupdate, ID tidak ditemukan" });
    }

    res.json({ message: "Berhasil update data program" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM renstra_program WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data gagal dihapus, ID tidak ditemukan" });
    }

    res.json({ message: "Berhasil hapus data program" });
  } catch (err) {
    next(err);
  }
}