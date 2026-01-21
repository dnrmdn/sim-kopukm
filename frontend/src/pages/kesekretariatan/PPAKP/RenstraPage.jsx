// src/pages/RenstraPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import HirarkiComponents from "@/components/kesekretariatan/HirarkiComponents";
import EditableHirarkiCRUD from "@/components/kesekretariatan/EditableHirarkiCRUD";
import RenstraProgramsComponent from "@/components/kesekretariatan/RenstraProgramsComponent";

export default function RenstraPage() {
  // ===== LOGIC TIDAK DIUBAH =====
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [error, setError] = useState(null);
  const [showEditable, setShowEditable] = useState(false);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          delete payload.id;
          delete payload.title;
          delete payload.created_at;
          delete payload.updated_at;
          delete payload.created_by;
        }

        return {
          id: r.id,
          title: r.title ?? payload.title ?? r.title,
          created_at: r.created_at ?? r.createdAt,
          updated_at: r.updated_at ?? r.updatedAt,
          created_by: r.created_by ?? r.createdBy,
          ...payload,
          data: payload,
        };
      });

      setList(unified);

      if (unified.length > 0) {
        setSelectedId(unified[0].id);
        setSelectedData(unified[0]);
      } else {
        setSelectedId(null);
        setSelectedData(null);
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
    setSelectedData(null);
    setLoadingSelected(true);
    try {
      const item = list.find((it) => Number(it.id) === Number(id));
      if (item) {
        setSelectedData(item);
      } else {
        const res = await axiosInstance.get(`/hirarki/${id}`);
        const r = res.data;
        let payload = {};
        if (r.data && typeof r.data === "object") payload = r.data;
        else if (r.data && typeof r.data === "string") {
          try { payload = JSON.parse(r.data); } catch { payload = {}; }
        } else payload = { ...r };

        setSelectedData({
          id: r.id,
          title: r.title ?? payload.title,
          ...payload,
          data: payload,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingSelected(false);
    }
  }
  // ===== END LOGIC =====

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-600 font-semibold">
        Memuat data Renstra...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-red-600 font-bold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-blue-600 rounded-full" />
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Perencanaan Strategis
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              RENCANA STRATEGIS <span className="text-blue-600">(RENSTRA)</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Dinkopukm Kabupaten Karawang
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 text-right">
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Status
            </span>
            <span className="text-sm font-black text-slate-700">
              Sistem Hirarki Aktif
            </span>
          </div>
        </header>

        {/* ===== TOOLBAR ===== */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Pilih Hirarki
              </label>
              <select
                value={selectedId ?? ""}
                onChange={(e) =>
                  onSelectChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="block w-full mt-1 bg-transparent font-bold text-slate-700 focus:outline-none"
              >
                <option value="">-- pilih --</option>
                {list.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.title || `Hirarki #${it.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchList}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-100"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowEditable((s) => !s)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200"
            >
              {showEditable ? "Tutup Editor" : "Buka Editor"}
            </button>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <main className="space-y-6">

          {/* Hirarki Viewer */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {loadingSelected ? (
              <div className="text-slate-500 font-medium">
                Memuat data terpilih...
              </div>
            ) : selectedData ? (
              <HirarkiComponents data={selectedData.data ?? selectedData} />
            ) : (
              <div className="text-slate-500 font-medium">
                Silakan pilih hirarki.
              </div>
            )}
          </div>

          {/* Editable Drawer */}
          {showEditable && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
              <EditableHirarkiCRUD />
            </div>
          )}

          {/* Programs Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
            <RenstraProgramsComponent apiBase="/programs" />
          </div>
        </main>

        {/* ===== FOOTER ===== */}
        <footer className="mt-12 py-6 text-center border-t border-slate-200">
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            © 2026 E-Planning Dinkopukm Karawang
          </p>
        </footer>

      </div>
    </div>
  );
}
