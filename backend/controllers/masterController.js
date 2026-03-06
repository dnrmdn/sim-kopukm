import pool from "../config/db.js";

// 1. Ambil Data Program Renstra
export async function getPrograms(req, res, next) {
  try {
    const query = 'SELECT id, kodering, nama_program AS name FROM renstra_program ORDER BY id ASC';
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 2. Ambil Data Kegiatan (Bisa difilter berdasarkan program_id)
export async function getKegiatan(req, res, next) {
  try {
    const { program_id } = req.query;
    let query = 'SELECT id, program_id, kodering, nama_kegiatan AS name FROM renstra_kegiatan';
    const values = [];

    if (program_id) {
      query += ' WHERE program_id = ?';
      values.push(program_id);
    }
    
    query += ' ORDER BY id ASC';

    const [rows] = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 3. Ambil Data Sub Kegiatan (Bisa difilter berdasarkan kegiatan_id)
export async function getSubKegiatan(req, res, next) {
  try {
    const { kegiatan_id } = req.query;
    let query = 'SELECT id, kegiatan_id, kodering, nama_sub AS name, satuan FROM renstra_sub_kegiatan';
    const values = [];

    if (kegiatan_id) {
      query += ' WHERE kegiatan_id = ?';
      values.push(kegiatan_id);
    }

    query += ' ORDER BY id ASC';

    const [rows] = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 4. Ambil Data Pegawai beserta Jabatannya
export async function getPegawai(req, res, next) {
  try {
    const query = `
      SELECT 
        p.id_pegawai AS id, 
        p.nama_lengkap AS nama, 
        p.nip, 
        j.nama_jabatan AS jabatan 
      FROM pegawai p
      LEFT JOIN jabatan j ON p.jabatan_definitif = j.id_jabatan
      ORDER BY p.nama_lengkap ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 5. Ambil Data Jenis Pagu
export async function getPagu(req, res, next) {
  try {
    const query = 'SELECT id, jenis FROM pagu ORDER BY id ASC';
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 6. Ambil Data Satuan
export async function getSatuan(req, res, next) {
  try {
    const query = `
      SELECT DISTINCT satuan AS name 
      FROM renstra_sub_kegiatan 
      WHERE satuan IS NOT NULL AND satuan != '' 
      ORDER BY satuan ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}