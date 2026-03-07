import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import InputRKA from "./components/InputRKA";
import BelanjaSection from "./components/BelanjaSection";
import RkaTreeTable from "./components/RkaTable";
import DashboardSuper from "./components/DashboardSuper";

export default function RkaPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const years = ["2026", "2027", "2028", "2029", "2030"]; // Daftar tahun anggaran

  // State Kontrol Tampilan
  const [showInputModal, setShowInputModal] = useState(false);
  const [showBelanjaStep, setShowBelanjaStep] = useState(false);
  
  // State Data
  const [currentRkaDetail, setCurrentRkaDetail] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [rkaForm, setRkaForm] = useState({
    program_id: "", 
    kegiatan_id: "", 
    subkegiatan_id: "",
    penanggungjawab_id: "", 
    pelaksana_id: "",
    tanggal_mulai: "", 
    tanggal_selesai: "",
    target_sub: "", 
    jenis_pagu: "",
    satuan_id: ""
  });

  const [options, setOptions] = useState({
    programs: [], 
    kegiatan: [], 
    subkegiatan: [], 
    pegawai: [], 
    pagu: [],
    satuan: []
  });
useEffect(() => { 
  loadInitialMaster();
}, []);

// 3. Fetch List RKA (Setiap kali tahun berubah)
useEffect(() => { 
  fetchList();
}, [selectedYear]);
  async function fetchList() {
  setLoading(true);
  try {
    // Mengirimkan ?tahun=2026 ke backend
    const res = await axiosInstance.get(`/rka?tahun=${selectedYear}`);
    setList(res.data || []);
  } catch (err) { 
    console.error("Gagal fetch list RKA:", err); 
  } finally { 
    setLoading(false); 
  }
}

// Fungsi loadInitialMaster tetap sama
async function loadInitialMaster() {
  try {
    const [p, pg, pa, sa] = await Promise.all([
      axiosInstance.get("/master/programs"),
      axiosInstance.get("/master/pegawai"),
      axiosInstance.get("/master/pagu"),
      axiosInstance.get("/master/satuan")
    ]);
    setOptions(prev => ({ 
      ...prev, 
      programs: p.data, 
      pegawai: pg.data, 
      pagu: pa.data,
      satuan: sa.data
    }));
  } catch (err) { console.error(err); }
}

  const fetchKegiatan = async (programId) => {
    if (!programId) return;
    try {
      const res = await axiosInstance.get(`/master/kegiatan?program_id=${programId}`);
      setOptions(prev => ({ ...prev, kegiatan: res.data, subkegiatan: [] }));
    } catch (err) { console.error(err); }
  };

  const fetchSubKegiatan = async (kegiatanId) => {
    if (!kegiatanId) return;
    try {
      const res = await axiosInstance.get(`/master/sub-kegiatan?kegiatan_id=${kegiatanId}`);
      setOptions(prev => ({ ...prev, subkegiatan: res.data }));
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (row) => {
    setLoading(true);
    try {
      setIsEditMode(true);
      setEditingId(row.id);

      // Load data cascading agar dropdown terisi saat edit
      await Promise.all([
        fetchKegiatan(row.program_id),
        fetchSubKegiatan(row.kegiatan_id)
      ]);

      setRkaForm({
        program_id: row.program_id,
        kegiatan_id: row.kegiatan_id,
        subkegiatan_id: row.subkegiatan_id,
        penanggungjawab_id: row.penanggungjawab_id,
        pelaksana_id: row.pelaksana_id,
        tanggal_mulai: row.tanggal_mulai ? row.tanggal_mulai.split('T')[0] : "",
        tanggal_selesai: row.tanggal_selesai ? row.tanggal_selesai.split('T')[0] : "",
        target_sub: row.target_angka,
        satuan_id: row.target_satuan,
        jenis_pagu: row.jenis_pagu || row.pagu_id,
        satuan_id: row.satuan_id
      });

      setCurrentRkaDetail({
        program: { name: row.program_name },
        kegiatan: { name: row.kegiatan_name },
        subkegiatan: { name: row.subkegiatan_name },
        pelaksana: { nama: row.pelaksana_name || "Petugas" }
      });

      setShowBelanjaStep(true);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat rincian edit");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBelanja = async (belanjaRows) => {
  try {
    let rkaId = editingId;
    
    // 1. Siapkan Payload Header secara Eksplisit
    // Pastikan semua field yang dibutuhkan Backend ada di sini
    const headerPayload = {
      subkegiatan_id: rkaForm.subkegiatan_id,
      penanggungjawab_id: rkaForm.penanggungjawab_id,
      pelaksana_id: rkaForm.pelaksana_id,
      tanggal_mulai: rkaForm.tanggal_mulai,
      tanggal_selesai: rkaForm.tanggal_selesai,
      target_sub: rkaForm.target_sub,
      satuan: rkaForm.satuan_id,
      jenis_pagu: rkaForm.jenis_pagu,
      tahun: selectedYear, // Mengambil dari state selectedYear di RkaPage
    };

    // 2. Eksekusi Update atau Create Header
    if (isEditMode) {
      await axiosInstance.put(`/rka/${editingId}`, headerPayload);
    } else {
      const res = await axiosInstance.post("/rka", headerPayload);
      // Ambil ID yang baru saja dibuat oleh database
      rkaId = res.data.id_rka || res.data.id;
    }

    // 3. Simpan Rincian Belanja
    // Kita bungkus dalam satu request post ke endpoint belanja
    await axiosInstance.post(`/rka/${rkaId}/belanja`, { 
      items: belanjaRows,
      jenis_pagu: rkaForm.jenis_pagu 
    });

    alert("Data RKA dan Rincian Belanja Berhasil Disimpan!");
    
    // 4. Cleanup & Refresh
    handleCloseAll(); // Tutup modal/form
    if (typeof fetchList === 'function') fetchList(); // Refresh tabel utama
    
  } catch (err) {
    // Log error lebih detail agar mudah di-debug di console
    console.error("Detail Error Simpan:", err.response?.data || err.message);
    
    const msg = err.response?.data?.message || "Terjadi kesalahan pada server";
    alert("Gagal menyimpan: " + msg);
  }
};
  const handleCloseAll = () => {
    setShowInputModal(false);
    setShowBelanjaStep(false);
    setIsEditMode(false);
    setEditingId(null);
    setRkaForm({ 
      program_id: "", kegiatan_id: "", subkegiatan_id: "", 
      penanggungjawab_id: "", pelaksana_id: "", 
      tanggal_mulai: "", tanggal_selesai: "", 
      target_sub: "", jenis_pagu: "", satuan_id: "" 
    });
  };

  if (loading && !showBelanjaStep) {
    return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">MEMUAT DATA...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      {!showBelanjaStep ? (
        <>
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">RKA</h1>
      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black tracking-widest border border-blue-200">
        TA {selectedYear}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">Manajemen Rencana Kerja Anggaran</p>
  </div>

  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
    {/* Selector Tahun Anggaran */}
    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm group hover:border-blue-400 transition-all">
      <div className="px-3 py-1.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 pr-10 cursor-pointer outline-none"
      >
        {years.map((y) => (
          <option key={y} value={y}>Tahun Anggaran {y}</option>
        ))}
      </select>
    </div>

    <button 
      onClick={() => setShowInputModal(true)} 
      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
    >
      <span className="text-xl">+</span>
      INPUT RKA {selectedYear}
    </button>
  </div>
</header>

          <DashboardSuper data={list} />

          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <RkaTreeTable data={list} onEdit={handleEdit} onDeleteSuccess={fetchList} />
          </div>
        </>
      ) : (
        <BelanjaSection 
          currentRkaDetail={currentRkaDetail} 
          rkaForm={rkaForm}
          onSave={handleSaveBelanja} 
          onCancel={handleCloseAll}
          isEditMode={isEditMode}
          editingId={editingId}
        />
      )}

      {showInputModal && (
  <InputRKA
    setShowInputModal={setShowInputModal}
    rkaForm={{ ...rkaForm, tahun: selectedYear }} 
    onChangeForm={(key, value) => {
      // 1. Update state dasar
      setRkaForm((prev) => ({ ...prev, [key]: value }));

      // 2. Logika Cascade: Program -> Kegiatan
      if (key === "program_id") {
        setRkaForm((p) => ({ ...p, kegiatan_id: "", subkegiatan_id: "", satuan_id: "" }));
        fetchKegiatan(value);
      }

      // 3. Logika Cascade: Kegiatan -> Sub Kegiatan
      if (key === "kegiatan_id") {
        setRkaForm((p) => ({ ...p, subkegiatan_id: "", satuan_id: "" }));
        fetchSubKegiatan(value);
      }

      // 4. Logika Otomatisasi Satuan saat Sub Kegiatan dipilih
      if (key === "subkegiatan_id") {
        const selectedSub = options.subkegiatan.find((s) => s.id == value);
        if (selectedSub && selectedSub.satuan) {
          // Mengisi satuan_id secara otomatis dari master renstra_sub_kegiatan
          setRkaForm((p) => ({ ...p, satuan_id: selectedSub.satuan }));
        }
      }
    }}
    handleSubmitRka={() => {
      // Mencari data objek lengkap untuk ditampilkan di ringkasan (header belanja)
      const prog = options.programs.find((p) => p.id == rkaForm.program_id);
      const keg = options.kegiatan.find((k) => k.id == rkaForm.kegiatan_id);
      const sub = options.subkegiatan.find((s) => s.id == rkaForm.subkegiatan_id);
      const pel = options.pegawai.find((p) => p.id == rkaForm.pelaksana_id);

      setCurrentRkaDetail({
        program: prog || { name: "Program" },
        kegiatan: keg || { name: "Kegiatan" },
        subkegiatan: sub || { name: "Sub Kegiatan" },
        pelaksana: pel || { nama: "Pelaksana" },
        // Tambahkan info target ke detail untuk review
        target: `${rkaForm.target_sub} ${rkaForm.satuan_id}`
      });

      setShowInputModal(false);
      setShowBelanjaStep(true);
    }}
    renstraPrograms={options.programs}
    kegiatanOptions={options.kegiatan}
    subkegiatanOptions={options.subkegiatan}
    pegawaiList={options.pegawai}
    paguOptions={options.pagu}
    satuanOptions={options.satuan} // Data dari getSatuan (SELECT DISTINCT)
  />
)}
    </div>
  );
}