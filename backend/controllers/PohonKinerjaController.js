import pool from "../config/db.js";

export async function getPohonKinerja(req, res, next) {
  try {
    // let { tahun } = req.query; // Bisa digunakan nanti untuk filter tahun

    let query = `
      SELECT 
        /* Level Hirarki (Bupati & Kepala Dinas) */
        h_sasaran.uraian AS sasaran_daerah,
        h_indikator.uraian AS indikator_daerah,

        /* Level Program (Bidang) */
        rp.id AS id_program,
        rp.nama_program,
        rp.output_program AS sasaran_program,
        rp.indikator_program,

        /* Level Kegiatan (Subkoor) */
        rk.id AS id_kegiatan,
        rk.nama_kegiatan,
        rk.output_kegiatan AS sasaran_kegiatan,
        rk.indikator_kegiatan,

        /* Level Sub Kegiatan (Pelaksana) */
        rsk.id AS id_sub,
        rsk.nama_sub,
        rsk.output_sub AS sasaran_sub,
        rsk.indikator_sub
        
      FROM renstra_program rp
      LEFT JOIN renstra_kegiatan rk ON rp.id = rk.program_id
      LEFT JOIN renstra_sub_kegiatan rsk ON rk.id = rsk.kegiatan_id
      LEFT JOIN hirarki h_indikator ON 1=1 
      LEFT JOIN hirarki h_sasaran ON h_indikator.parent_id = h_sasaran.id
      
      ORDER BY rp.kodering, rk.kodering, rsk.kodering ASC
    `;
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error getPohonKinerja:", err);
    next(err);
  }
}