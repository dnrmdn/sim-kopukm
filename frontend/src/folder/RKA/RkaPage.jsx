import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import InputRKA from "./components/InputRKA";
import BelanjaSection from "./components/BelanjaSection";
import RkaTreeTable from "./components/RkaTable";
import DashboardSuper from "./components/DashboardSuper";

export default function RkaPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Form & Modals
  const [showInputModal, setShowInputModal] = useState(false);
  const [showBelanjaStep, setShowBelanjaStep] = useState(false);
  const [currentRkaDetail, setCurrentRkaDetail] = useState(null);
  const [rkaForm, setRkaForm] = useState({
    program_id: "",
    kegiatan_id: "",
    subkegiatan_id: "",
    penanggungjawab_id: "",
    pelaksana_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    target_sub: "",
    jenis_pagu: ""
  });

  // Master Data Options
  const [options, setOptions] = useState({
    programs: [], 
    kegiatan: [], 
    subkegiatan: [], 
    pegawai: [], 
    pagu: [], 
    satuan: [{id: 1, name: 'Dokumen'}, {id: 2, name: 'Bulan'}]
  });

  useEffect(() => { 
    fetchList();
    loadInitialMaster();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/rka");
      setList(res.data || []);
    } catch (err) { 
      console.error("Fetch List Error:", err); 
    } finally { 
      setLoading(false); 
    }
  }

  async function loadInitialMaster() {
    try {
      const [p, pg, pa] = await Promise.all([
        axiosInstance.get("/master/programs"),
        axiosInstance.get("/master/pegawai"),
        axiosInstance.get("/master/pagu")
      ]);
      setOptions(prev => ({ 
        ...prev, 
        programs: p.data, 
        pegawai: pg.data, 
        pagu: pa.data 
      }));
    } catch (err) {
      console.error("Load Master Error:", err);
    }
  }

  // Handler Cascading Dropdown
  const onChangeForm = async (key, val) => {
    setRkaForm(prev => ({ ...prev, [key]: val }));
    
    if (key === "program_id") {
      const res = await axiosInstance.get(`/master/kegiatan?program_id=${val}`);
      setOptions(prev => ({ ...prev, kegiatan: res.data, subkegiatan: [] }));
    }
    if (key === "kegiatan_id") {
      const res = await axiosInstance.get(`/master/sub-kegiatan?kegiatan_id=${val}`);
      setOptions(prev => ({ ...prev, subkegiatan: res.data }));
    }
  };

  const handleSubmitRka = () => {
    // Validasi sederhana sebelum lanjut ke belanja
    if (!rkaForm.subkegiatan_id || !rkaForm.pelaksana_id) {
      return alert("Mohon lengkapi data Sub Kegiatan dan Pelaksana");
    }

    // Cari detail object untuk ditampilkan di header BelanjaSection
    const prog = options.programs.find(p => p.id == rkaForm.program_id);
    const keg = options.kegiatan.find(k => k.id == rkaForm.kegiatan_id);
    const sub = options.subkegiatan.find(s => s.id == rkaForm.subkegiatan_id);
    const pel = options.pegawai.find(p => p.id == rkaForm.pelaksana_id);

    setCurrentRkaDetail({
      program: prog,
      kegiatan: keg,
      subkegiatan: sub,
      pelaksana: pel
    });

    setShowInputModal(false);
    setShowBelanjaStep(true);
  };

  /**
   * ALUR SIMPAN DUA TAHAP (FIXED)
   */
  const handleSaveBelanja = async (belanjaRows) => {
    try {
      // TAHAP 1: Simpan Header RKA (Sesuai rkaController.createRka)
      const resHeader = await axiosInstance.post("/rka", {
        subkegiatan_id: rkaForm.subkegiatan_id,
        penanggungjawab_id: rkaForm.penanggungjawab_id,
        pelaksana_id: rkaForm.pelaksana_id,
        tanggal_mulai: rkaForm.tanggal_mulai,
        tanggal_selesai: rkaForm.tanggal_selesai,
        target_sub: rkaForm.target_sub,
        jenis_pagu: rkaForm.jenis_pagu
      });

      const newIdRka = resHeader.data.id_rka;

      // TAHAP 2: Simpan Rincian Belanja (Sesuai rkaController.saveBelanja)
      await axiosInstance.post(`/rka/${newIdRka}/belanja`, {
        items: belanjaRows // Mapping dilakukan di dalam BelanjaSection atau di sini
      });

      alert("Data RKA dan Rincian Belanja Berhasil Disimpan!");
      
      // Reset State
      setShowBelanjaStep(false);
      setRkaForm({
        program_id: "", kegiatan_id: "", subkegiatan_id: "", 
        penanggungjawab_id: "", pelaksana_id: "", 
        tanggal_mulai: "", tanggal_selesai: "", 
        target_sub: "", jenis_pagu: ""
      });
      
      fetchList();
    } catch (err) { 
      console.error("Save Error:", err);
      alert("Gagal simpan data: " + (err.response?.data?.message || err.message)); 
    }
  };

  // Suplai props ke komponen anak
  const rkaProps = {
    showInputModal, setShowInputModal,
    showBelanjaStep, setShowBelanjaStep,
    rkaTreeData: list,
    currentRkaDetail,
    rkaForm,
    onChangeForm,
    handleSubmitRka,
    handleSaveBelanja,
    renstraPrograms: options.programs,
    kegiatanOptions: options.kegiatan,
    subkegiatanOptions: options.subkegiatan,
    pegawaiList: options.pegawai,
    satuanList: options.satuan,
    paguOptions: options.pagu
  };

  if (loading) return <div className="p-10 animate-pulse text-blue-600 font-bold">LOADING DATA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">RENCANA KERJA ANGGARAN (RKA)</h1>
          <p className="text-slate-500 text-sm">Sistem Perencanaan & Manajemen Anggaran</p>
        </div>
        {!showBelanjaStep && (
          <button 
            onClick={() => setShowInputModal(true)} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            + INPUT RKA BARU
          </button>
        )}
      </header>

      {/* Tampilan Dashboard Statistik */}
      {!showBelanjaStep && <DashboardSuper data={list} />}

      {/* Konten Utama: Tabel RKA atau Form Belanja */}
      <main>
        {!showBelanjaStep ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {list.length > 0 ? (
              <RkaTreeTable data={list} onEdit={() => setShowInputModal(true)} />
            ) : (
              <div className="p-20 text-center">
                <div className="text-slate-300 mb-2">Empty Data</div>
                <p className="text-slate-400 italic text-sm">Belum ada data RKA yang tersimpan.</p>
              </div>
            )}
          </div>
        ) : (
          <BelanjaSection 
            currentRkaDetail={currentRkaDetail} 
            rkaForm={rkaForm}
            onSave={handleSaveBelanja} 
            onCancel={() => setShowBelanjaStep(false)} 
          />
        )}
      </main>

      {/* Modal Step 1: Input Header */}
      {showInputModal && (
        <InputRKA 
          {...rkaProps} 
          onClose={() => setShowInputModal(false)} 
          onSubmit={handleSubmitRka} 
        />
      )}
    </div>
  );
}