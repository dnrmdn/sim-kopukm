import pool from "../../config/db.js";

// GET ALL
export async function getAll(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM renstra_tahun ORDER BY tahun ASC"
    );
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
      "SELECT * FROM renstra_tahun WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Tahun tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// CREATE
export async function create(req, res, next) {
  try {
    const { tahun } = req.body;
    const [result] = await pool.query(
      "INSERT INTO renstra_tahun (tahun) VALUES (?)",
      [tahun]
    );
    res.status(201).json({ message: "Berhasil tambah tahun", id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// UPDATE
export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { tahun } = req.body;
    await pool.query("UPDATE renstra_tahun SET tahun = ? WHERE id = ?", [tahun, id]);
    res.json({ message: "Berhasil update tahun" });
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM renstra_tahun WHERE id = ?", [id]);
    res.json({ message: "Berhasil hapus tahun" });
  } catch (err) {
    next(err);
  }
}