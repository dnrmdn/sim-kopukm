import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const { program_id } = req.query;
    let query = `
      SELECT k.*, 
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'tahun', t.tahun,
            'target', ka.target,
            'pagu', ka.pagu
          )
        )
        FROM renstra_kegiatan_anggaran ka
        JOIN renstra_tahun t ON ka.tahun_id = t.id
        WHERE ka.kegiatan_id = k.id
      ) as anggaran
      FROM renstra_kegiatan k
    `;
    
    let params = [];
    if (program_id) {
      query += " WHERE k.program_id = ?";
      params.push(program_id);
    }

    const [rows] = await pool.query(query, params);
    const result = rows.map(row => ({
      ...row,
      anggaran: typeof row.anggaran === 'string' ? JSON.parse(row.anggaran) : (row.anggaran || [])
    }));
    res.json(result);
  } catch (err) { next(err); }
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
      output_kegiatan,
      indikator_kegiatan, 
      keterangan
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO renstra_kegiatan 
      (program_id, kodering, nama_kegiatan, output_kegiatan ,indikator_kegiatan, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [program_id, kodering, nama_kegiatan, output_kegiatan, indikator_kegiatan, keterangan]
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