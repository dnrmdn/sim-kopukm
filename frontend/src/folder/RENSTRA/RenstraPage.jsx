import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Plus, GitGraph, ClipboardList, FileText, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Komponen
import Dashboard from "@/folder/RENSTRA/components/Dashboard";
import HirarkiComponents from "@/folder/RENSTRA/components/HirarkiComponents";
import AddProgramModal from "@/folder/RENSTRA/components/AddProgramModal";
import TabelProgram from "@/folder/RENSTRA/components/TabelProgram";
import TabelDokumen from "@/folder/RENSTRA/components/TabelDokumen";
import AddDokumenModal from "@/folder/RENSTRA/components/AddDokumenModal";
import Footer from "@/components/Footer";

export default function RenstraPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAddProgram, setOpenAddProgram] = useState(false);
  const [openAddDokumen, setOpenAddDokumen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [resHirarki, resDokumen] = await Promise.all([
        axiosInstance.get("/hirarki"),
        axiosInstance.get("/renstra/dokumen"),
      ]);
      setList(resHirarki.data || []);
      setDokumen(resDokumen.data || []);
    } catch (err) {
      console.error("Error loading:", err);
      setError("Gagal memuat data. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
      </div>

      <div className="relative z-10">
        {/* Header Utama */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-20 shadow-sm">
          <div className="w-full px-4 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <ClipboardList size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Rencana Strategis
                  </h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Pohon kinerja, program strategis, dan dokumen pendukung organisasi</p>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Kembali</span>
              </button>
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
                  onClick={fetchData}
                  className="shrink-0 px-3 py-1 rounded-lg bg-red-200/70 hover:bg-red-300 text-red-700 font-medium text-xs transition-all duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Memuat data Renstra...</p>
          </div>
        ) : (
          <main className="w-full px-4 sm:px-8 py-8 space-y-6">

            {/* Dashboard */}
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-1">
                <Dashboard />
              </div>
            </div>

            {/* 1. Pohon Kinerja */}
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-6 sm:p-8">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                    <GitGraph size={16} className="text-white" />
                  </div>
                  Pohon Kinerja Organisasi
                </h2>
                <HirarkiComponents data={list} />
              </div>
            </div>

            {/* 2. Tabel Program */}
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                      <ClipboardList size={16} className="text-white" />
                    </div>
                    Rencana Strategis (Program)
                  </h2>
                  <button
                    onClick={() => setOpenAddProgram(true)}
                    className="px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 text-white"
                  >
                    <Plus size={15} />
                    <span className="hidden sm:inline">Tambah Program</span>
                  </button>
                </div>
                <TabelProgram apiBase="/renstra/program" />
              </div>
            </div>

            {/* 3. Dokumen Pendukung */}
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                      <FileText size={16} className="text-white" />
                    </div>
                    Dokumen Pendukung
                  </h2>
                  <button
                    onClick={() => setOpenAddDokumen(true)}
                    className="px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 text-white"
                  >
                    <Plus size={15} />
                    <span className="hidden sm:inline">Upload Dokumen</span>
                  </button>
                </div>
                <TabelDokumen data={dokumen} onSuccess={fetchData} />
              </div>
            </div>

          </main>
        )}

        {/* Footer */}
        <Footer>
          <span>Total Dokumen: {dokumen.length}</span>
          <span>Total Program: {list.length}</span>
        </Footer>
      </div>

      {/* Modals */}
      <AddProgramModal open={openAddProgram} onClose={() => setOpenAddProgram(false)} onSuccess={fetchData} />
      <AddDokumenModal open={openAddDokumen} onClose={() => setOpenAddDokumen(false)} onSuccess={fetchData} />
    </div>
  );
}