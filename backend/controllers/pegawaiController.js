import pool from "../config/db.js";

/**
 * 📋 Get all employees
 */
export const getAllPegawai = async (req, res) => {
  try {
    // Gunakan JOIN untuk mendapatkan nama jabatan, bukan sekadar ID angka
    const query = `
  SELECT 
    id_pegawai AS id, 
    nama_lengkap AS nama, 
    nip, 
    jabatan_definitif AS jabatan_id, 
    level 
  FROM pegawai 
  ORDER BY nama_lengkap ASC
`;
    
    res.json({ success: true, data: query });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ➕ Create a new employee
 */
export const createPegawai = async (req, res) => {
  const { nama, nip, jabatan, email } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO pegawai (nama, nip, jabatan, email) VALUES (?, ?, ?, ?)",
      [nama, nip, jabatan, email]
    );
    res.status(201).json({ 
      success: true, 
      message: "Pegawai berhasil ditambahkan", 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✏️ Update employee data
 */
export const updatePegawai = async (req, res) => {
  const { id } = req.params;
  const { nama, nip, jabatan, email } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE pegawai SET nama = ?, nip = ?, jabatan = ?, email = ? WHERE id = ?",
      [nama, nip, jabatan, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pegawai tidak ditemukan" });
    }

    res.json({ success: true, message: "Data pegawai berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🗑️ Delete an employee
 */
export const deletePegawai = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM pegawai WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pegawai tidak ditemukan" });
    }

    res.json({ success: true, message: "Pegawai berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};