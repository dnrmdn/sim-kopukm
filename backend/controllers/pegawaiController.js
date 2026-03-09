import pool from "../config/db.js";

/**
 * 📋 Get all pegawai (dengan nama jabatan & atasan)
 */
export const getPegawai = async (req, res, next) => {
  const { id } = req.params;

  try {
    let query = `
      SELECT 
        p.id_pegawai,
        p.nama_lengkap,
        p.nip,
        p.jabatan_definitif,
        j.nama_jabatan,
        p.level,
        ph.id_atasan
      FROM pegawai p
      LEFT JOIN jabatan j 
        ON p.jabatan_definitif = j.id_jabatan
      LEFT JOIN pegawai_hirarki ph 
        ON p.id_pegawai = ph.id_pegawai
    `;

    const params = [];

    // Kalau ada ID → tambah WHERE
    if (id) {
      query += " WHERE p.id_pegawai = ?";
      params.push(id);
    }

    query += " ORDER BY p.nama_lengkap ASC";

    const [rows] = await pool.query(query, params);

    // Kalau mode get by id
    if (id) {
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pegawai tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        data: rows[0],
      });
    }

    // Mode get all
    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("pegawai:get", err);
    return next(err);
  }
};

/**
 * ➕ Create new pegawai (dengan id_jabatan dan id_atasan)
 */
export const createPegawai = async (req, res, next) => {
  const { nama_lengkap, nip, level, id_jabatan, id_atasan } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Insert ke tabel pegawai
    const [result] = await connection.query(
      `INSERT INTO pegawai 
       (nama_lengkap, nip, jabatan_definitif, level) 
       VALUES (?, ?, ?, ?)`,
      [nama_lengkap, nip, id_jabatan || null, level || 0]
    );

    const pegawaiId = result.insertId;

    // 2️⃣ Insert ke tabel pegawai_hirarki jika ada id_atasan
    if (id_atasan && id_atasan !== "0") {
      await connection.query(
        `INSERT INTO pegawai_hirarki (id_pegawai, id_atasan) 
         VALUES (?, ?)`,
        [pegawaiId, id_atasan]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Pegawai berhasil ditambahkan",
      id: pegawaiId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("pegawai:create", err);
    return next(err);
  } finally {
    connection.release();
  }
};

/**
 * ✏️ Update pegawai (dengan id_jabatan dan id_atasan)
 */
export const updatePegawai = async (req, res, next) => {
  const { id } = req.params;
  const { nama_lengkap, nip, level, id_jabatan, id_atasan } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Update tabel pegawai
    const [result] = await connection.query(
      `UPDATE pegawai 
       SET nama_lengkap = ?, nip = ?, jabatan_definitif = ?, level = ?
       WHERE id_pegawai = ?`,
      [nama_lengkap, nip, id_jabatan || null, level || 0, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Pegawai tidak ditemukan",
      });
    }

    // 2️⃣ Update tabel pegawai_hirarki
    if (id_atasan && id_atasan !== "0") {
      // cek apakah sudah ada relasi
      const [existing] = await connection.query(
        "SELECT * FROM pegawai_hirarki WHERE id_pegawai = ?",
        [id]
      );

      if (existing.length > 0) {
        await connection.query(
          "UPDATE pegawai_hirarki SET id_atasan = ? WHERE id_pegawai = ?",
          [id_atasan, id]
        );
      } else {
        await connection.query(
          "INSERT INTO pegawai_hirarki (id_pegawai, id_atasan) VALUES (?, ?)",
          [id, id_atasan]
        );
      }
    } else {
      // kalau pilih tidak ada atasan → hapus relasi
      await connection.query(
        "DELETE FROM pegawai_hirarki WHERE id_pegawai = ?",
        [id]
      );
    }

    await connection.commit();

    return res.json({
      success: true,
      message: "Data pegawai berhasil diperbarui",
    });
  } catch (err) {
    await connection.rollback();
    console.error("pegawai:update", err);
    return next(err);
  } finally {
    connection.release();
  }
};

/**
 * 🗑️ Delete pegawai
 */
export const deletePegawai = async (req, res, next) => {
  const { id } = req.params;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Delete dari pegawai_hirarki (cascade)
    await connection.query(
      "DELETE FROM pegawai_hirarki WHERE id_pegawai = ?",
      [id]
    );

    // 2️⃣ Delete dari pegawai
    const [result] = await connection.query(
      "DELETE FROM pegawai WHERE id_pegawai = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Pegawai tidak ditemukan",
      });
    }

    await connection.commit();

    return res.json({
      success: true,
      message: "Pegawai berhasil dihapus",
    });
  } catch (err) {
    await connection.rollback();
    console.error("pegawai:delete", err);
    return next(err);
  } finally {
    connection.release();
  }
};