import pool from "../config/db.js";

// GET ALL RKA (Untuk RkaTable dan RkaTreeTable)
export async function getAllRka(req, res, next) {
  try {
    const query = `
        SELECT 
          rh.id_rka AS id,
          rp.nama_program AS program_name,
          rk.nama_kegiatan AS kegiatan_name,
          rsk.nama_sub AS subkegiatan_name,
          rsk.keterangan,
          rt.tahun AS renstra_year,
          rh.target_kinerja AS capaian,
          COALESCE(SUM(rb.volume * rb.harga_satuan), 0) AS murni,
          COALESCE(SUM(rb.pergeseran_1), 0) AS pergeseran_i,
          COALESCE(SUM(rb.pergeseran_2), 0) AS pergeseran_ii,
          0 AS efisiensi, 
          COALESCE(SUM(rb.perubahan), 0) AS perubahan,
          COALESCE(SUM(rb.realisasi), 0) AS realisasi,
          MAX(rb.file_eviden) AS eviden
        FROM rka_header rh
        JOIN renstra_sub_kegiatan rsk ON rh.id_sub_kegiatan = rsk.id
        JOIN renstra_kegiatan rk ON rsk.kegiatan_id = rk.id
        JOIN renstra_program rp ON rk.program_id = rp.id
        LEFT JOIN renstra_tahun rt ON rh.id_tahun = rt.id
        LEFT JOIN rka_belanja rb ON rh.id_rka = rb.id_rka
        GROUP BY rh.id_rka
        ORDER BY rh.id_rka DESC
      `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

/// Di rkaController.js pada fungsi createRka
export async function createRka(req, res, next) {
  try {
    const {
      subkegiatan_id,
      penanggungjawab_id,
      pelaksana_id,
      tanggal_mulai,
      tanggal_selesai,
      target_sub,
      jenis_pagu,
    } = req.body;

    const id_tahun = 1; 

    // Pastikan nilai kosong dikonversi ke NULL agar tidak error di MySQL
    const values = [
      subkegiatan_id || null,
      id_tahun,
      jenis_pagu || null,
      penanggungjawab_id || null,
      pelaksana_id || null,
      tanggal_mulai || null,
      tanggal_selesai || null,
      target_sub || null,
    ];

    const query = `
        INSERT INTO rka_header 
        (id_sub_kegiatan, id_tahun, pagu_id, id_pj, id_pelaksana, tgl_mulai, tgl_selesai, target_kinerja) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

    // Gunakan pool.query sesuai format baru kita
    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "Data RKA berhasil ditambahkan",
      id_rka: result.insertId,
    });
  } catch (err) {
    console.error("DATABASE ERROR:", err.sqlMessage); // Agar terlihat di terminal nodemon
    next(err); 
  }
}

// DELETE RKA
export async function deleteRka(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM rka_header WHERE id_rka = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data RKA tidak ditemukan" });
    }

    res.json({ message: "Data RKA berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}

// SAVE BELANJA (Transaction support)
export async function saveBelanja(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params; // id_rka
    const { items } = req.body;

    await connection.beginTransaction();

    const query = `
        INSERT INTO rka_belanja 
        (id_rka, uraian_belanja, koefisien, volume, harga_satuan) 
        VALUES (?, ?, ?, ?, ?)
      `;

    for (const item of items) {
      await connection.execute(query, [
        id,
        item.belanja,
        item.koef,
        item.perhitungan,
        item.harga_satuan,
      ]);
    }

    await connection.commit();
    res.status(201).json({ message: "Rincian Belanja berhasil disimpan!" });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

