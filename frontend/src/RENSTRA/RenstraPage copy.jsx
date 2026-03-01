import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import HirarkiComponents from "../RENSTRA/components/HirarkiComponents";
import EditableHirarkiCRUD from "@/components/kesekretariatan/EditableHirarkiCRUD";
import RenstraProgramsComponent from "../RENSTRA/components/RenstraProgramsComponent";
import { RefreshCw, Layout, Edit3, X, ChevronRight, Layers } from "lucide-react";

export default function RenstraPage() {
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [error, setError] = useState(null);
  const [showEditable, setShowEditable] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/hirarki");
      const raw = res.data || [];

      const unified = raw.map((r) => {
        let payload = {};
        if (r.data && typeof r.data === "object") {
          payload = r.data;
        } else if (r.data && typeof r.data === "string") {
          try { payload = JSON.parse(r.data); } catch { payload = {}; }
        } else {
          payload = { ...r };
          ["id", "title", "created_at", "updated_at", "created_by"].forEach(k => delete payload[k]);
        }

        return {
          id: r.id,
          title: r.title ?? payload.title ?? `Hirarki #${r.id}`,
          created_at: r.created_at ?? r.createdAt,
          ...payload,
          data: payload,
        };
      });

      setList(unified);
      if (unified.length > 0 && !selectedId) {
        setSelectedId(unified[0].id);
        setSelectedData(unified[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSelectChange(id) {
    if (!id) {
      setSelectedId(null);
      setSelectedData(null);
      return;
    }
    setSelectedId(id);
    setLoadingSelected(true);
    try {
      const item = list.find((it) => Number(it.id) === Number(id));
      if (item) {
        setSelectedData(item);
      } else {
        const res = await axiosInstance.get(`/hirarki/${id}`);
        const r = res.data;
        let payload = typeof r.data === "string" ? JSON.parse(r.data) : (r.data || r);
        setSelectedData({ id: r.id, title: r.title, data: payload });
      }
    } catch (err) {
      setError("Gagal memuat detail.");
    } finally {
      setLoadingSelected(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-widest animate-pulse">MEMUAT RENSTRA...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-2 bg-blue-600 rounded-full" />
              <span className="text-xs font-black tracking-[0.2em] text-blue-600 uppercase">Perencanaan Strategis</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              RENCANA STRATEGIS <span className="text-blue-600">/ RENSTRA</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Layout size={16} /> Dinkopukm Kabupaten Karawang
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[240px]">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-1">Periode Hirarki</label>
              <select
                value={selectedId ?? ""}
                onChange={(e) => onSelectChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">-- Pilih Hirarki --</option>
                {list.map((it) => (
                  <option key={it.id} value={it.id}>{it.title}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowEditable(true)} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Edit3 size={18} /> Editor Hirarki
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="grid grid-cols-1 gap-8">
          
          {/* 1. VISUALISASI HIRARKI (Visi, Misi, dkk) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Layers className="text-blue-600" size={24} />
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Visualisasi Pohon Kinerja</h2>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative min-h-[400px]">
              {loadingSelected ? (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
                  <RefreshCw className="animate-spin text-blue-600" size={32} />
                </div>
              ) : selectedData ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <HirarkiComponents data={selectedData.data ?? selectedData} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <p className="font-bold text-lg uppercase tracking-widest">Data Tidak Tersedia</p>
                  <p className="text-sm">Silakan pilih periode hirarki pada dropdown di atas</p>
                </div>
              )}
            </div>
          </section>

          {/* 2. MATRIKS PROGRAM & KEGIATAN (The Big Table) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <ChevronRight size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Matriks Program, Kegiatan & Sub-Kegiatan</h2>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden shadow-blue-900/5">
              <RenstraProgramsComponent apiBase="/programs" />
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="pt-10 pb-20 text-center">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">
            © 2026 E-Planning Dinkopukm Karawang • Ver 2.1
          </p>
        </footer>

        {/* FLOATING EDITOR OVERLAY (MODAL-STYLE) */}
        {showEditable && (
          <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex justify-end transition-all duration-500">
            <div className="w-full max-w-5xl bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Hirarki Strategy Editor</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase">Manajemen Visi, Misi, dan Tujuan Strategis</p>
                </div>
                <button 
                  onClick={() => { setShowEditable(false); fetchList(); }}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <EditableHirarkiCRUD />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}