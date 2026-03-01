import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { X, Save } from "lucide-react";

// Modal Wrapper (Tetap sama)
const Modal = ({ title, open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b bg-slate-50">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default function AddProgramModal({ open, onClose, onSuccess }) {
  // DISESUAIKAN DENGAN STRUKTUR DB/BACKEND
  const [form, setForm] = useState({
    kodering: "",
    nama_program: "", 
    output_program: "",     // Tadinya "name"
    indikator_program: "", 
    keterangan: ""          // Tadinya "indikator"
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Endpoint sesuai prefix API yang lo kasih tadi
      await axiosInstance.post("/renstra/program", form);
      
      // Reset form
      setForm({ kodering: "", nama_program: "", indikator_program: "" });
      onSuccess(); 
      onClose();
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Tambah Program Baru" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Kodering</label>
            <input
              placeholder="Contoh: 1.01.01"
              value={form.kodering}
              onChange={(e) => setForm({ ...form, kodering: e.target.value })}
              className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Nama Program *</label>
            <input
              required
              placeholder="Masukkan nama program..."
              value={form.nama_program}
              onChange={(e) => setForm({ ...form, nama_program: e.target.value })}
              className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Output Program</label>
            <textarea
              rows="3"
              placeholder="Masukkan output capaian..."
              value={form.output_program}
              onChange={(e) => setForm({ ...form, output_program: e.target.value })}
              className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Indikator Program</label>
            <textarea
              rows="3"
              placeholder="Masukkan indikator capaian..."
              value={form.indikator_program}
              onChange={(e) => setForm({ ...form, indikator_program: e.target.value })}
              className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Keterangan</label>
          <textarea
            rows="3"
            placeholder="Masukkan keterangan..."
            value={form.keterangan}
            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-slate-300 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Program
          </button>
        </div>
      </form>
    </Modal>
  );
}