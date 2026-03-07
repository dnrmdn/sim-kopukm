import pool from "../config/db.js";

// GET ALL RKA (Dengan Filter Tahun)
export async function getAllRka(req, res, next) {
  try {
    // Menangkap ?tahun= dari frontend
    const { tahun } = req.query;

    let query = `
        SELECT 
          rh.id_rka AS id,
          p.nama_lengkap AS pj_nama,
          rh.target_kinerja AS target_angka,
          rh.id_sub_kegiatan AS subkegiatan_id,
          rh.id_pj AS penanggungjawab_id,
          rh.id_pelaksana AS pelaksana_id,
          rh.pagu_id AS jenis_pagu,
          rh.tgl_mulai AS tanggal_mulai,
          rh.tgl_selesai AS tanggal_selesai,
          rh.satuan AS target_satuan,
          rh.id_tahun AS tahun,
          
          /* Ambil ID Master dari hasil JOIN */
          rk.program_id AS program_id,
          rsk.kegiatan_id AS kegiatan_id,
          
          /* Ambil Nama Master */
          rp.nama_program AS program_name,
          rk.nama_kegiatan AS kegiatan_name,
          rsk.nama_sub AS subkegiatan_name,
          
          /* Hitung Total */
          COALESCE(SUM(rb.pagu_murni), 0) AS murni, 
          COALESCE(SUM(rb.pergeseran_1), 0) AS pergeseran_i,
          COALESCE(SUM(rb.pergeseran_2), 0) AS pergeseran_ii,
          COALESCE(SUM(rb.efisiensi), 0) AS efisiensi, 
          COALESCE(SUM(rb.perubahan), 0) AS perubahan
        FROM rka_header rh
        LEFT JOIN pegawai p ON rh.id_pj = p.id_pegawai
        LEFT JOIN renstra_sub_kegiatan rsk ON rh.id_sub_kegiatan = rsk.id
        LEFT JOIN renstra_kegiatan rk ON rsk.kegiatan_id = rk.id
        LEFT JOIN renstra_program rp ON rk.program_id = rp.id
        LEFT JOIN rka_belanja rb ON rh.id_rka = rb.id_rka
    `;

    const queryParams = [];
    if (tahun) {
      query += ` WHERE rh.id_tahun = ? `;
      queryParams.push(tahun);
    }

    query += ` GROUP BY rh.id_rka ORDER BY rh.id_rka DESC `;

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error("Query Error:", err.message);
    next(err);
  }
}

// CREATE RKA (Menyimpan tahun dinamis)
export async function createRka(req, res, next) {
  try {
    const {
      subkegiatan_id,
      penanggungjawab_id,
      pelaksana_id,
      tanggal_mulai,
      tanggal_selesai,
      target_sub,
      satuan,
      jenis_pagu,
      tahun // Diambil dari rkaForm.tahun yang dikirim frontend
    } = req.body;

    // Gunakan tahun dari frontend, jika tidak ada baru gunakan fallback
    const id_tahun = tahun || new Date().getFullYear().toString();

    const values = [
      subkegiatan_id || null,
      id_tahun,
      jenis_pagu || null,
      penanggungjawab_id || null,
      pelaksana_id || null,
      tanggal_mulai || null,
      tanggal_selesai || null,
      target_sub || null,
      satuan || null
    ];

    const query = `
        INSERT INTO rka_header 
        (id_sub_kegiatan, id_tahun, pagu_id, id_pj, id_pelaksana, tgl_mulai, tgl_selesai, target_kinerja, satuan) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "Data RKA berhasil ditambahkan",
      id_rka: result.insertId,
    });
  } catch (err) {
    console.error("DATABASE ERROR:", err.sqlMessage);
    next(err); 
  }
}

// UPDATE RKA
export async function updateRka(req, res, next) {
  try {
    const { id } = req.params;
    const {
      subkegiatan_id,
      penanggungjawab_id,
      pelaksana_id,
      tanggal_mulai,
      tanggal_selesai,
      target_sub,
      satuan,
      jenis_pagu,
      tahun // Kita ambil tahun dari body
    } = req.body;

    // Tambahkan log untuk debug di terminal backend Anda
    console.log("Updating RKA ID:", id, "dengan data:", req.body);

    const query = `
      UPDATE rka_header 
      SET 
        id_sub_kegiatan = ?, 
        pagu_id = ?, 
        id_pj = ?, 
        id_pelaksana = ?, 
        tgl_mulai = ?, 
        tgl_selesai = ?, 
        target_kinerja = ?,
        satuan = ?,
        id_tahun = ?
      WHERE id_rka = ?
    `;

    // Pastikan urutan values SAMA dengan urutan tanda tanya (?) di query atas
    const values = [
      subkegiatan_id || null,
      jenis_pagu || null,
      penanggungjawab_id || null,
      pelaksana_id || null,
      tanggal_mulai || null,
      tanggal_selesai || null,
      target_sub || null,
      satuan || null,
      tahun || null, // Ini mengisi id_tahun
      id             // Ini untuk WHERE id_rka
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data RKA tidak ditemukan di database" });
    }

    res.json({ message: "Data RKA berhasil diperbarui" });
  } catch (err) {
    console.error("ERROR UPDATE RKA:", err.sqlMessage || err.message);
    // Mengirim pesan error yang lebih detail ke frontend agar mudah dilacak
    res.status(500).json({ 
      message: "Gagal update database", 
      error: err.sqlMessage || err.message 
    });
  }
}

// SAVE BELANJA (Transaction support)
export async function saveBelanja(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { items, jenis_pagu } = req.body; 

    await connection.beginTransaction();

    // Hapus data lama agar tidak duplikat
    await connection.execute("DELETE FROM rka_belanja WHERE id_rka = ?", [id]);

    const query = `
        INSERT INTO rka_belanja 
        (id_rka, uraian_belanja, koefisien, volume, harga_satuan, pergeseran_1, pergeseran_2, efisiensi, perubahan) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    for (const item of items) {
      const totalNilai = (item.perhitungan || 0) * (item.harga_satuan || 0);
      
      let vol = 0;
      let harga = 0;
      let p1 = 0;
      let p2 = 0;
      let efisiensi = 0;
      let perubahan = 0;

      // PEMETAAN BERDASARKAN ID JENIS PAGU
      // Sesuaikan angka string "1", "2" dsb dengan ID di tabel master_pagu Anda
      const tipe = String(jenis_pagu);

      switch (tipe) {
        case "1": // PAGU MURNI
          vol = item.perhitungan || 0;
          harga = item.harga_satuan || 0;
          break;
        case "2": // PERGESERAN I
          p1 = totalNilai;
          break;
        case "3": // PERGESERAN II
          p2 = totalNilai;
          break;
        case "4": // EFISIENSI
          efisiensi = totalNilai;
          break;
        case "5": // PERUBAHAN
          perubahan = totalNilai;
          break;
        default:
          // Default jika tidak ada yang cocok, masuk ke murni
          vol = item.perhitungan || 0;
          harga = item.harga_satuan || 0;
      }

      await connection.execute(query, [
        id,
        item.belanja,
        item.koef || "",
        vol,
        harga,
        p1,
        p2,
        efisiensi,
        perubahan
      ]);
    }

    await connection.commit();
    res.status(201).json({ message: "Rincian Belanja (termasuk Efisiensi) berhasil disimpan!" });
  } catch (err) {
    await connection.rollback();
    console.error("Error Detail:", err.message);
    next(err);
  } finally {
    connection.release();
  }
}

// GET BELANJA BY RKA ID
export async function getBelanjaByRka(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        id_belanja AS id,
        uraian_belanja AS belanja,
        koefisien AS koef,
        volume AS perhitungan,
        harga_satuan,
        (volume * harga_satuan) AS murni,
        pergeseran_1 AS pergeseran_i,
        pergeseran_2 AS pergeseran_ii,
        perubahan,
        realisasi
      FROM rka_belanja 
      WHERE id_rka = ?
    `;
    const [rows] = await pool.query(query, [id]);
    res.json(rows);
  } catch (err) {
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