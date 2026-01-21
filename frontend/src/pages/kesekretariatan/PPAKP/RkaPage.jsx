// src/pages/RkaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

import InputRKA from "@/components/kesekretariatan/InputRKA";
import BelanjaSection from "@/components/umkm/BelanjaSection";
import RkaTable from "@/components/kesekretariatan/RkaTable";

function formatIdr(x) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(x || 0));
}

export default function RkaPage() {
  // --- LOGIC: TIDAK DISENTUH ---
  const defaultYear = new Date().getFullYear() + 1;
  const [year, setYear] = useState(defaultYear);
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1, y + 2, y + 3, y + 4];
  }, []);

  const [renstraPrograms, setRenstraPrograms] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(true);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showBelanjaStep, setShowBelanjaStep] = useState(false);

  const [rkaForm, setRkaForm] = useState({
    program_id: null,
    kegiatan_id: null,
    subkegiatan_id: null,
    target_sub: "",
    satuan: "",
    penanggungjawab_id: null,
    pelaksana_id: null,
    tanggal_mulai: "",
    tanggal_selesai: "",
  });
  const [currentRkaDetail, setCurrentRkaDetail] = useState(null);
  const [rkaTableData, setRkaTableData] = useState([]);

  useEffect(() => {
    loadAllMasters();
    fetchRkaTable();
  }, []);

  async function loadAllMasters() {
    setLoadingMasters(true);
    try {
      await Promise.all([fetchRenstra(), fetchPegawai(), fetchSatuan()]);
    } catch (err) {
      console.error("loadAllMasters error", err);
    } finally {
      setLoadingMasters(false);
    }
  }

  async function fetchRenstra() {
    try {
      const res = await axiosInstance.get("/renstra/programs");
      const programs = Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.programs ?? []);
      setRenstraPrograms(programs);
    } catch (err) {
      setRenstraPrograms([]);
    }
  }

  async function fetchPegawai() {
    try {
      const res = await axiosInstance.get("/pegawai");
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setPegawaiList(arr);
    } catch (err) {
      setPegawaiList([]);
    }
  }

  async function fetchSatuan() {
    try {
      const res = await axiosInstance.get("/renstra/satuans");
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setSatuanList(arr);
    } catch (err) {
      setSatuanList([]);
    }
  }

  async function fetchRkaTable(y = year) {
    try {
      const res = await axiosInstance.get(`/rka?year=${y}`);
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setRkaTableData(arr);
    } catch (err) {
      setRkaTableData([]);
    }
  }

  function onChangeForm(key, value) {
    setRkaForm((prev) => ({ ...prev, [key]: value }));
  }

  const kegiatanOptions = useMemo(() => {
    if (!rkaForm.program_id) return [];
    const p = renstraPrograms.find((x) => Number(x.id) === Number(rkaForm.program_id));
    return p?.kegiatans || [];
  }, [rkaForm.program_id, renstraPrograms]);

  const subkegiatanOptions = useMemo(() => {
    if (!rkaForm.kegiatan_id) return [];
    const k = kegiatanOptions.find((x) => Number(x.id) === Number(rkaForm.kegiatan_id));
    return k?.subkegiatans || [];
  }, [rkaForm.kegiatan_id, kegiatanOptions]);

  async function handleSubmitRka(e) {
    e?.preventDefault?.();
    if (!rkaForm.program_id || !rkaForm.kegiatan_id || !rkaForm.subkegiatan_id) {
      return alert("Program, Kegiatan, Sub Kegiatan wajib dipilih.");
    }
    try {
      const payload = { year, ...rkaForm };
      const res = await axiosInstance.post("/rka", payload);
      const saved = res.data;
      const prog = renstraPrograms.find((p) => Number(p.id) === Number(rkaForm.program_id));
      const keg = (prog?.kegiatans || []).find((k) => Number(k.id) === Number(rkaForm.kegiatan_id));
      const sub = (keg?.subkegiatans || []).find((s) => Number(s.id) === Number(rkaForm.subkegiatan_id));

      setCurrentRkaDetail({
        id: saved?.id ?? saved?.insertId ?? null,
        program: prog,
        kegiatan: keg,
        subkegiatan: sub,
        penanggungjawab: pegawaiList.find((p) => Number(p.id) === Number(rkaForm.penanggungjawab_id)) || null,
        pelaksana: pegawaiList.find((p) => Number(p.id) === Number(rkaForm.pelaksana_id)) || null,
        tanggal_mulai: rkaForm.tanggal_mulai,
        tanggal_selesai: rkaForm.tanggal_selesai,
      });

      setShowInputModal(false);
      setShowBelanjaStep(true);
      fetchRkaTable();
    } catch (err) {
      alert("Gagal menyimpan RKA.");
    }
  }

  async function handleSaveBelanja(items) {
    if (!currentRkaDetail?.id) return alert("RKA belum tersimpan id-nya.");
    try {
      await axiosInstance.post(`/rka/${currentRkaDetail.id}/belanja`, { items });
      alert("Belanja tersimpan.");
      setShowBelanjaStep(false);
      setCurrentRkaDetail(null);
      fetchRkaTable();
    } catch (err) {
      alert("Gagal menyimpan belanja");
    }
  }
  // --- END LOGIC ---

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">Perencanaan & Anggaran</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              RENCANA KERJA ANGGARAN <span className="text-blue-600">(RKA)</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 uppercase tracking-wider">Dinkopukm Kabupaten Karawang</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 text-center md:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase block tracking-tighter">Periode Anggaran</span>
            <span className="text-2xl font-black text-slate-700">TAHUN {year}</span>
          </div>
        </header>

        {/* Toolbar Section */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
              <label className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Pilih Tahun:</label>
              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  fetchRkaTable(y);
                }}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer min-w-[80px]"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <button 
              onClick={() => setShowInputModal(true)} 
              className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              INPUT RKA BARU
            </button>
          </div>

          {/* Module Nav - Disabled States */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-start xl:justify-end">
            {["KAK","Cascading","PK","Rencana Aksi","Pohon Kinerja","Manajemen Resiko"].map(t => (
              <button 
                key={t} 
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-slate-200 bg-white text-slate-300 rounded-lg cursor-not-allowed" 
                disabled
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="space-y-6">
          {!showBelanjaStep && (
            <>
              {/* Status Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${loadingMasters ? 'bg-amber-50 text-amber-500 animate-pulse' : 'bg-emerald-50 text-emerald-500'}`}>
                    {loadingMasters ? (
                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 leading-none mb-1">Status Sistem</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {loadingMasters ? "Sinkronisasi data master..." : `Data tahun ${year} siap dikelola`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg">
                   <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                   TOTAL: {rkaTableData.length} KEGIATAN
                </div>
              </div>

              {/* Table Component Container */}
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-200">
                <RkaTable data={rkaTableData} onEdit={() => setShowInputModal(true)} />
              </div>
            </>
          )}

          {/* Stepper View for Belanja */}
          {showBelanjaStep && currentRkaDetail && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BelanjaSection 
                currentRkaDetail={currentRkaDetail} 
                rkaForm={rkaForm} 
                onSave={handleSaveBelanja} 
                onCancel={() => setShowBelanjaStep(false)} 
              />
            </div>
          )}
        </main>

        {/* Modal Logic Remains Untouched */}
        {showInputModal && (
          <InputRKA
            renstraPrograms={renstraPrograms}
            kegiatanOptions={kegiatanOptions}
            subkegiatanOptions={subkegiatanOptions}
            pegawaiList={pegawaiList}
            satuanList={satuanList}
            rkaForm={rkaForm}
            onChangeForm={onChangeForm}
            onClose={() => setShowInputModal(false)}
            onSubmit={handleSubmitRka}
          />
        )}
      </div>
      
      {/* Footer / Copyright */}
      <footer className="mt-12 py-6 text-center border-t border-slate-200">
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          &copy; 2026 E-Budgeting Dinkopukm Karawang
        </p>
      </footer>
    </div>
  );
}