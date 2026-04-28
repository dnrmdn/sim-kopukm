import pool from "../../config/db.js"; // Sesuaikan dengan path pool database kamu

export async function getDashboardStats(req, res, next) {
  try {
    // Kita gunakan sub-query di dalam satu SELECT agar efisien (satu kali eksekusi)
    const [result] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM renstra_program) as total_program,
        (SELECT COUNT(*) FROM renstra_kegiatan) as total_kegiatan,
        (SELECT COUNT(*) FROM renstra_sub_kegiatan) as total_sub_kegiatan,
        (SELECT COUNT(*) FROM renstra_dokumen) as total_dokumen
    `);

    // Pastikan mengirim format JSON yang benar
    res.json({
      success: true,
      data: result[0]
    });
  } catch (err) {
    // Jika ada error (misal tabel tidak ada), akan ditangkap oleh middleware error
    next(err);
  }
}