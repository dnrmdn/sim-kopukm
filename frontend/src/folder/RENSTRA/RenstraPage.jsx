import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import HirarkiComponents from "@/folder/RENSTRA/components/HirarkiComponents";
import AddProgramModal from "@/folder/RENSTRA/components/AddProgramModal"; 
import TabelProgram from "@/folder/RENSTRA/components/TabelProgram";

export default function RenstraPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddProgram, setOpenAddProgram] = useState(false);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/hirarki");
      setList(res.data || []);
    } catch (err) {
      console.error("Error fetching hirarki:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10 text-xs font-mono text-slate-500 animate-pulse">LOADING DATA...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="max-w-full mx-auto p-6 space-y-8">
        
        {/* 1. SEKSI POHON KINERJA */}
        <section className="bg-slate-50 border border-slate-200 p-6 rounded-sm">
          <HirarkiComponents data={list} />
        </section>

        {/* 2. TABEL PROGRAM & KEGIATAN */}
        <section className="space-y-4">
          <div className="border border-slate-200 bg-white shadow-sm">
            <TabelProgram 
              apiBase="/renstra/program" 
              onAddProgram={() => setOpenAddProgram(true)} 
            />
          </div>
        </section>

        <AddProgramModal 
          open={openAddProgram} 
          onClose={() => setOpenAddProgram(false)} 
          onSuccess={() => fetchList()} 
        />
      </div>
    </div>
  );
}