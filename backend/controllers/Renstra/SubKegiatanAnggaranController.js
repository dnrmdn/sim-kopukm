import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    // Ambil filter dari query string
    const { sub_kegiatan_id, tahun_id } = req.query; 

    let query = `
      SELECT 
        a.*, 
        sk.nama_sub, 
        t.tahun 
      FROM renstra_sub_kegiatan_anggaran a
      LEFT JOIN renstra_sub_kegiatan sk ON a.sub_kegiatan_id = sk.id
      LEFT JOIN renstra_tahun t ON a.tahun_id = t.id
    `;
    
    let params = [];
    let conditions = [];

    // Filter berdasarkan Sub Kegiatan
    if (sub_kegiatan_id) {
      conditions.push("a.sub_kegiatan_id = ?");
      params.push(sub_kegiatan_id);
    }

    // Filter berdasarkan Tahun (Opsional)
    if (tahun_id) {
      conditions.push("a.tahun_id = ?");
      params.push(tahun_id);
    }

    // Gabungkan kondisi jika ada
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Urutkan berdasarkan tahun agar rapi (2026 ke 2030)
    query += " ORDER BY t.tahun ASC, a.id DESC";

    const [rows] = await pool.query(query, params);
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

async function updateParentTotals(connection, sub_kegiatan_id, tahun_ids) {
  // 1. Ambil Info Parent (kegiatan_id & program_id)
  const [info] = await connection.query(
    `SELECT k.id as kegiatan_id, k.program_id 
     FROM renstra_sub_kegiatan sk
     JOIN renstra_kegiatan k ON sk.kegiatan_id = k.id
     WHERE sk.id = ?`, [sub_kegiatan_id]
  );
  
  if (info.length === 0) return;
  const { kegiatan_id, program_id } = info[0];

  // 2. Loop update untuk setiap tahun yang terlibat
  for (const tahun_id of tahun_ids) {
    // Update Level KEGIATAN (Sum dari semua Sub)
    await connection.query(
      `INSERT INTO renstra_kegiatan_anggaran (kegiatan_id, tahun_id, pagu, target)
       SELECT ?, ?, SUM(pagu), 100 
       FROM renstra_sub_kegiatan_anggaran sa
       JOIN renstra_sub_kegiatan s ON sa.sub_kegiatan_id = s.id
       WHERE s.kegiatan_id = ? AND sa.tahun_id = ?
       ON DUPLICATE KEY UPDATE pagu = VALUES(pagu), target = 100`,
      [kegiatan_id, tahun_id, kegiatan_id, tahun_id]
    );

    // Update Level PROGRAM (Sum dari semua Kegiatan)
    await connection.query(
      `INSERT INTO renstra_program_anggaran (program_id, tahun_id, pagu, target)
       SELECT ?, ?, SUM(pagu), 100 
       FROM renstra_kegiatan_anggaran ka
       JOIN renstra_kegiatan k ON ka.kegiatan_id = k.id
       WHERE k.program_id = ? AND ka.tahun_id = ?
       ON DUPLICATE KEY UPDATE pagu = VALUES(pagu), target = 100`,
      [program_id, tahun_id, program_id, tahun_id]
    );
  }
}

// CREATE
export async function create(req, res, next) {
  const connection = await pool.getConnection(); // Ambil koneksi untuk transaction
  try {
    await connection.beginTransaction();

    const { sub_kegiatan_id, anggaran_list } = req.body;

    if (!anggaran_list || !Array.isArray(anggaran_list)) {
      return res.status(400).json({ message: "Data anggaran harus berupa array" });
    }

    const values = anggaran_list.map(item => [
      sub_kegiatan_id,
      item.tahun_id,
      item.target || 0,
      item.pagu || 0
    ]);

    // INSERT UTAMA
    const [result] = await connection.query(
      `INSERT INTO renstra_sub_kegiatan_anggaran 
      (sub_kegiatan_id, tahun_id, target, pagu) VALUES ?`, 
      [values]
    );

    // --- TRIGGER LOGIC AGREGASI DI SINI ---
    const tahunIds = anggaran_list.map(a => a.tahun_id);
    await updateParentTotals(connection, sub_kegiatan_id, tahunIds);
    // --------------------------------------

    await connection.commit(); // Simpan permanen jika semua ok

    res.status(201).json({ 
      message: `Berhasil menambah ${result.affectedRows} data anggaran & sinkronisasi otomatis`,
      sub_kegiatan_id
    });
  } catch (err) {
    await connection.rollback(); // Batalkan semua jika ada error di tengah jalan
    next(err);
  } finally {
    connection.release(); // Balikin koneksi ke pool
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