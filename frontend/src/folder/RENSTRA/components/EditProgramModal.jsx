import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Edit3 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";

export default function EditProgramModal({ open, onClose, onSuccess, programData }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kodering: "",
    nama_program: "",
    output_program: "",
    indikator_program: "",
    keterangan: "",
  });

  // Isi form otomatis saat modal dibuka atau programData berubah
  useEffect(() => {
    if (programData) {
      setFormData({
        kodering: programData.kodering || "",
        nama_program: programData.nama_program || "",
        output_program: programData.output_program || "",
        indikator_program: programData.indikator_program || "",
        keterangan: programData.keterangan || "",
      });
    }
  }, [programData, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/renstra/program/${programData.id}`, formData);
      
      Swal.fire("Berhasil!", "Data program telah diperbarui.", "success");
      onSuccess(); // Refresh tabel
      onClose();   // Tutup modal
    } catch (err) {
      Swal.fire("Gagal!", err.response?.data?.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="bg-blue-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Edit Program</h3>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">ID Program: {programData?.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kodering Program</label>
              <input
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                value={formData.kodering}
                onChange={(e) => setFormData({ ...formData, kodering: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Program</label>
              <input
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                value={formData.nama_program}
                onChange={(e) => setFormData({ ...formData, nama_program: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Indikator Program</label>
            <textarea
              required
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold min-h-[80px]"
              value={formData.indikator_program}
              onChange={(e) => setFormData({ ...formData, indikator_program: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Output Program</label>
            <input
              required
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
              value={formData.output_program}
              onChange={(e) => setFormData({ ...formData, output_program: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Keterangan</label>
            <input
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 px-6 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all uppercase text-sm">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-sm">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}