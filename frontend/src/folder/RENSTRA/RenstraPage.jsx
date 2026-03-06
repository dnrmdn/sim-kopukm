import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

// Komponen
import Dashboard from "@/folder/RENSTRA/components/Dashboard";
import HirarkiComponents from "@/folder/RENSTRA/components/HirarkiComponents";
import AddProgramModal from "@/folder/RENSTRA/components/AddProgramModal"; 
import TabelProgram from "@/folder/RENSTRA/components/TabelProgram";
import TabelDokumen from "@/folder/RENSTRA/components/TabelDokumen"; // Nama diperbaiki
import AddDokumenModal from "@/folder/RENSTRA/components/AddDokumenModal";

export default function RenstraPage() {
  const [list, setList] = useState([]);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [openAddProgram, setOpenAddProgram] = useState(false);
  const [openAddDokumen, setOpenAddDokumen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [resHirarki, resDokumen] = await Promise.all([
        axiosInstance.get("/hirarki"),
        axiosInstance.get("/renstra/dokumen")
      ]);
      setList(resHirarki.data || []);
      setDokumen(resDokumen.data || []);
    } catch (err) {
      console.error("Error loading:", err);
    } finally {
      setLoading(false);
    }
  }

  const sectionStyle = "bg-white border border-slate-200 rounded-sm p-6 shadow-sm";
  const headerStyle = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2";

  if (loading) return <div className="p-20 text-center text-slate-400 text-xs font-mono">LOADING SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      
      {/* 0. HEADER DINAS (Diberi bg agar senada) */}
      <div className="">
        <Dashboard />
      </div>

      <div className="p-6 space-y-6">
        {/* 1. SEKSI POHON KINERJA */}
        <section className={sectionStyle}>
          <h2 className={headerStyle}>Pohon Kinerja Organisasi</h2>
          <HirarkiComponents data={list} />
        </section>

        {/* 2. TABEL PROGRAM */}
        <section className={sectionStyle}>
          <h2 className={headerStyle}>Rencana Strategis (Program)</h2>
          <TabelProgram 
            apiBase="/renstra/program" 
            onAddProgram={() => setOpenAddProgram(true)} 
          />
        </section>

        {/* 3. DOKUMEN PENDUKUNG */}
        <section className={sectionStyle}>
          <div className="flex justify-between items-center mb-6">
              <h3 className={headerStyle.replace("mb-6", "")}>Dokumen Pendukung</h3>
              <button 
                  onClick={() => setOpenAddDokumen(true)}
                  className="flex items-center gap-2 text-[10px] bg-slate-900 text-white px-4 py-2 rounded-sm font-black uppercase hover:bg-blue-700 transition-all"
              >
                  <Plus size={12} /> Upload Dokumen
              </button>
          </div>
          <TabelDokumen data={dokumen} onSuccess={fetchData} />
        </section>
      </div>

      {/* MODALS */}
      <AddProgramModal open={openAddProgram} onClose={() => setOpenAddProgram(false)} onSuccess={fetchData} />
      <AddDokumenModal open={openAddDokumen} onClose={() => setOpenAddDokumen(false)} onSuccess={fetchData} />
    </div>
  );
}