import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    // Kueri ini mengambil data program sekaligus array anggarannya
    const query = `
      SELECT 
        p.*, 
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pa.id,
              'tahun_id', pa.tahun_id,
              'tahun', t.tahun,
              'target', pa.target,
              'pagu', pa.pagu
            )
          )
          FROM renstra_program_anggaran pa
          LEFT JOIN renstra_tahun t ON pa.tahun_id = t.id
          WHERE pa.program_id = p.id
        ) as anggaran
      FROM renstra_program p
      ORDER BY p.id DESC
    `;

    const [rows] = await pool.query(query);

    // Pastikan data anggaran di-parse dari string JSON ke Array Objek
    const result = rows.map(row => ({
      ...row,
      anggaran: row.anggaran 
        ? (typeof row.anggaran === 'string' ? JSON.parse(row.anggaran) : row.anggaran) 
        : []
    }));

    res.json(result);
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
      indikator_program,
      output_program
    } = req.body;

    // 1. Validasi sederhana
    if (!nama_program) {
      return res.status(400).json({ message: "Nama program wajib diisi" });
    }

    // 2. Query (Koma terakhir dihilangkan)
    const [result] = await pool.query(
      `INSERT INTO renstra_program 
      (kodering, nama_program, indikator_program,output_program) 
      VALUES (?, ?, ?, ?)`,
      [kodering || null, nama_program, indikator_program, output_program || null]
    );

    res.status(201).json({ 
      success: true,
      message: "Berhasil tambah data program", 
      id: result.insertId 
    });
  } catch (err) {
    // 3. Tangani error database (misal: kodering duplikat)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Kodering sudah terdaftar" });
    }
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