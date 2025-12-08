// backend/src/controllers/rkaController.js
import pool from "../config/db.js";

function fmtRow(row) {
  // ensure numeric fields present
  return {
    ...row,
    murni: Number(row.murni || 0),
    pergeseran_i: Number(row.pergeseran_i || 0),
    pergeseran_ii: Number(row.pergeseran_ii || 0),
    efisiensi: Number(row.efisiensi || 0),
    perubahan: Number(row.perubahan || 0),
  };
}

/**
 * GET /api/rka?year=YYYY
 * returns list of RKA with aggregated belanja sums and program/keg/sub names
 */
export async function listRka(req, res, next) {
  try {
    const year = req.query.year ? Number(req.query.year) : null;

    // base query: join programs/kegiatans/subkegiatans to get names
    let sql = `
      SELECT
        r.id,
        r.year,
        r.program_id,
        p.name AS program_name,
        r.kegiatan_id,
        k.name AS kegiatan_name,
        r.subkegiatan_id,
        s.name AS subkegiatan_name,
        r.keterangan,
        r.tanggal_mulai,
        r.tanggal_selesai,
        -- aggregate sums from rka_belanja
        COALESCE(SUM(rb.murni), 0) AS murni,
        COALESCE(SUM(rb.pergeseran_i), 0) AS pergeseran_i,
        COALESCE(SUM(rb.pergeseran_ii), 0) AS pergeseran_ii,
        COALESCE(SUM(rb.efisiensi), 0) AS efisiensi,
        COALESCE(SUM(rb.perubahan), 0) AS perubahan
      FROM rkas r
      LEFT JOIN programs p ON p.id = r.program_id
      LEFT JOIN kegiatans k ON k.id = r.kegiatan_id
      LEFT JOIN subkegiatans s ON s.id = r.subkegiatan_id
      LEFT JOIN rka_belanja rb ON rb.rka_id = r.id
      ${year ? "WHERE r.year = ?" : ""}
      GROUP BY r.id
      ORDER BY r.id DESC
    `;

    const params = year ? [year] : [];
    const [rows] = await pool.query(sql, params);
    const normalized = (rows || []).map(fmtRow);
    return res.json(normalized);
  } catch (err) {
    console.error("rka:list", err);
    return next(err);
  }
}

/**
 * POST /api/rka
 * create an RKA entry (basic)
 */
export async function createRka(req, res, next) {
  try {
    const { year, program_id, kegiatan_id, subkegiatan_id, target_sub, satuan, penanggungjawab_id, pelaksana_id, tanggal_mulai, tanggal_selesai, keterangan } = req.body;
    const [result] = await pool.query(
      `INSERT INTO rkas (year, program_id, kegiatan_id, subkegiatan_id, target_sub, satuan, penanggungjawab_id, pelaksana_id, tanggal_mulai, tanggal_selesai, keterangan, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [year, program_id, kegiatan_id, subkegiatan_id, target_sub || null, satuan || null, penanggungjawab_id || null, pelaksana_id || null, tanggal_mulai || null, tanggal_selesai || null, keterangan || null]
    );

    const insertedId = result.insertId;
    const [rows] = await pool.query("SELECT * FROM rkas WHERE id = ? LIMIT 1", [insertedId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("rka:create", err);
    return next(err);
  }
}

/**
 * POST /api/rka/:id/belanja
 * Accepts { items: [ { belanja, koef, perhitungan, harga_satuan, murni, pergeseran_i, pergeseran_ii, efisiensi, perubahan } ] }
 */
export async function addBelanja(req, res, next) {
  try {
    const rkaId = Number(req.params.id);
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!rkaId) return res.status(400).json({ message: "Invalid RKA id" });
    if (!items.length) return res.status(400).json({ message: "Items array required" });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const insertSql = `
        INSERT INTO rka_belanja (rka_id, belanja, koef, perhitungan, harga_satuan, murni, pergeseran_i, pergeseran_ii, efisiensi, perubahan, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      for (const it of items) {
        const koef = Number(it.koef || 0);
        const perhitungan = Number(it.perhitungan || 0);
        const harga = Number(it.harga_satuan || 0);
        const murni = Number(it.murni ?? (koef * perhitungan * harga));
        const pergeseran_i = Number(it.pergeseran_i || 0);
        const pergeseran_ii = Number(it.pergeseran_ii || 0);
        const efisiensi = Number(it.efisiensi || 0);
        const perubahan = Number(it.perubahan || 0);

        await conn.query(insertSql, [rkaId, it.belanja, koef, perhitungan, harga, murni, pergeseran_i, pergeseran_ii, efisiensi, perubahan]);
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    // Return updated aggregated totals for this RKA
    const [aggRows] = await pool.query(
      `SELECT
         COALESCE(SUM(murni),0) AS murni,
         COALESCE(SUM(pergeseran_i),0) AS pergeseran_i,
         COALESCE(SUM(pergeseran_ii),0) AS pergeseran_ii,
         COALESCE(SUM(efisiensi),0) AS efisiensi,
         COALESCE(SUM(perubahan),0) AS perubahan
       FROM rka_belanja
       WHERE rka_id = ?`,
      [rkaId]
    );

    return res.status(201).json({ id: rkaId, totals: aggRows[0] || {} });
  } catch (err) {
    console.error("rka:addBelanja", err);
    return next(err);
  }
}
