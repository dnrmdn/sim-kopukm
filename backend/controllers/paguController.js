import pool from "../config/db.js";

// GET ALL
export async function listPagu(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pagu ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET BY ID
export async function getPagu(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM pagu WHERE id = ?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function createPagu(req, res, next) {
  try {
    const { jenis } = req.body;

    const [result] = await pool.query(
      "INSERT INTO pagu (jenis) VALUES (?)",
      [jenis]
    );

    res.status(201).json({
      message: "Berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE
export async function updatePagu(req, res, next) {
  try {
    const { id } = req.params;
    const { jenis } = req.body;

    const [result] = await pool.query(
      "UPDATE pagu SET jenis = ? WHERE id = ?",
      [jenis, id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Berhasil diupdate" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function deletePagu(req, res, next) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM pagu WHERE id = ?",
      [id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}