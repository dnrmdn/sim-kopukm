import pool from "../config/db.js";

// 1. Ambil semua data hirarki (berdasarkan tahun)
export const getAllHirarki = async (req, res) => {
  const { tahun } = req.query; // Filter via query param ?tahun=2025
  try {
    let query = "SELECT * FROM hirarki";
    let params = [];

    if (tahun) {
      query += " WHERE tahun = ?";
      params.push(tahun);
    }

    query += " ORDER BY id ASC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// 2. Tambah data hirarki baru
export const createHirarki = async (req, res) => {
  const { tahun, parent_id, level, uraian, kode } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO hirarki (tahun, parent_id, level, uraian, kode) VALUES (?, ?, ?, ?, ?)",
      [tahun, parent_id || null, level, uraian, kode || null]
    );
    res.status(201).json({ id: result.insertId, message: "Data berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah data", error: error.message });
  }
};

// 3. Update data hirarki
export const updateHirarki = async (req, res) => {
  const { id } = req.params;
  const { uraian, kode, tahun } = req.body;
  try {
    await pool.query(
      "UPDATE hirarki SET uraian = ?, kode = ?, tahun = ? WHERE id = ?",
      [uraian, kode, tahun, id]
    );
    res.json({ message: "Data berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal update data", error: error.message });
  }
};

// 4. Hapus data hirarki
export const deleteHirarki = async (req, res) => {
  const { id } = req.params;
  try {
    // Karena kita pakai CONSTRAINT ... ON DELETE CASCADE di SQL,
    // menghapus ID ini akan otomatis menghapus semua anak/cucunya.
    await pool.query("DELETE FROM hirarki WHERE id = ?", [id]);
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error: error.message });
  }
};