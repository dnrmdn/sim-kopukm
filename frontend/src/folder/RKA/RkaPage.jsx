import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import InputRKA from "./components/InputRKA";
import BelanjaSection from "./components/BelanjaSection";
import RkaTreeTable from "./components/RkaTable";
import DashboardSuper from "./components/DashboardSuper";
import { Plus, FileText, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RkaPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showInputModal, setShowInputModal] = useState(false);
  const [showBelanjaStep, setShowBelanjaStep] = useState(false);
  const [currentRkaDetail, setCurrentRkaDetail] = useState(null);
  const [rkaForm, setRkaForm] = useState({
    program_id: "", kegiatan_id: "", subkegiatan_id: "",
    penanggungjawab_id: "", pelaksana_id: "",
    tanggal_mulai: "", tanggal_selesai: "",
    target_sub: "", jenis_pagu: ""
  });

  const [options, setOptions] = useState({
    programs: [], kegiatan: [], subkegiatan: [], pegawai: [], pagu: [],
    satuan: [{ id: 1, name: "Dokumen" }, { id: 2, name: "Bulan" }]
  });

  useEffect(() => {
    fetchList();
    loadInitialMaster();
  }, []);

  async function fetchList() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/rka");
      setList(res.data || []);
    } catch (err) {
      console.error("Fetch List Error:", err);
      setError("Gagal memuat data RKA. Silahkan coba lagi.");
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
      setOptions(prev => ({ ...prev, programs: p.data, pegawai: pg.data, pagu: pa.data }));
    } catch (err) {
      console.error("Load Master Error:", err);
    }
  }

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
    if (!rkaForm.subkegiatan_id || !rkaForm.pelaksana_id) {
      alert("Mohon lengkapi data Sub Kegiatan dan Pelaksana");
      return;
    }
    const prog = options.programs.find(p => p.id == rkaForm.program_id);
    const keg  = options.kegiatan.find(k => k.id == rkaForm.kegiatan_id);
    const sub  = options.subkegiatan.find(s => s.id == rkaForm.subkegiatan_id);
    const pel  = options.pegawai.find(p => p.id == rkaForm.pelaksana_id);
    setCurrentRkaDetail({ program: prog, kegiatan: keg, subkegiatan: sub, pelaksana: pel });
    setShowInputModal(false);
    setShowBelanjaStep(true);
  };

  const handleSaveBelanja = async (belanjaRows) => {
    try {
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
      await axiosInstance.post(`/rka/${newIdRka}/belanja`, { items: belanjaRows });

      alert("Data RKA dan Rincian Belanja Berhasil Disimpan!");
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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-20 shadow-sm">
          <div className="w-full px-4 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Rencana Kerja Anggaran
                  </h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Sistem Perencanaan & Manajemen Anggaran</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Kembali</span>
                </button>

                {!showBelanjaStep && (
                  <button
                    onClick={() => setShowInputModal(true)}
                    className="px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 text-white"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Input RKA Baru</span>
                  </button>
                )}

                {showBelanjaStep && (
                  <button
                    onClick={() => setShowBelanjaStep(false)}
                    className="px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Kembali ke Daftar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="w-full px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-red-200/50">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div className="flex-1"><p className="text-red-700">{error}</p></div>
                <button
                  onClick={fetchList}
                  className="shrink-0 px-3 py-1 rounded-lg bg-red-200/70 hover:bg-red-300 text-red-700 font-medium text-xs transition-all duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="w-full px-4 sm:px-8 py-8 space-y-6">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Memuat data RKA...</p>
            </div>
          ) : !showBelanjaStep ? (
            <>
              {/* Dashboard statistik */}
              <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
                <div className="p-1">
                  <DashboardSuper data={list} />
                </div>
              </div>

              {/* Tabel RKA */}
              <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />

                {list.length > 0 ? (
                  <div className="p-1">
                    <RkaTreeTable data={list} onEdit={() => setShowInputModal(true)} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-blue-300 rounded-3xl m-4 bg-linear-to-br from-blue-100/30 to-cyan-100/30">
                    <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
                      <FileText size={48} className="text-blue-400" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mb-2">Belum ada data RKA</p>
                    <p className="text-gray-600 text-sm mb-6 text-center max-w-sm">
                      Tambahkan RKA baru untuk memulai perencanaan anggaran
                    </p>
                    <button
                      onClick={() => setShowInputModal(true)}
                      className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 text-white flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Input RKA Baru
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Form Belanja */
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-1">
                <BelanjaSection
                  currentRkaDetail={currentRkaDetail}
                  rkaForm={rkaForm}
                  onSave={handleSaveBelanja}
                  onCancel={() => setShowBelanjaStep(false)}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-white/40 border-t border-blue-200/50 mt-20 shadow-sm">
          <div className="w-full px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total RKA: {list.length}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

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