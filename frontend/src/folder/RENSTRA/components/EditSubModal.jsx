import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, Loader2, Target, Wallet } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";

export default function EditSubModal({ open, onClose, onSuccess, subData, YEARS }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kodering: "",
    nama_sub: "",
    output_sub: "",
    indikator_sub: "",
    satuan: "",
    keterangan: "",
  });

  const [anggaranList, setAnggaranList] = useState([]);

  useEffect(() => {
    if (subData && open) {
      setFormData({
        kodering: subData.kodering || "",
        nama_sub: subData.nama_sub || "",
        output_sub: subData.output_sub || "",
        indikator_sub: subData.indikator_sub || "",
        satuan: subData.satuan || "",
        keterangan: subData.keterangan || "",
      });

      // Mapping Anggaran: Pastikan ID anggaran (89, 90, dll) ikut terbawa agar tidak duplicate
      const mappedAnggaran = YEARS.map((tahun, index) => {
        const existing = subData.anggaran?.find((a) => Number(a.tahun) === Number(tahun));
        return {
          id: existing?.id || null, // PENTING: ID primary key anggaran
          tahun_id: existing?.tahun_id || (index + 1),
          tahun: tahun,
          target: existing?.target || 0,
          pagu: existing?.pagu || 0,
        };
      });
      setAnggaranList(mappedAnggaran);
    }
  }, [subData, open, YEARS]);

  const handleAnggaranChange = (index, field, value) => {
    const updated = [...anggaranList];
    updated[index][field] = value;
    setAnggaranList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // GABREED: Gabungkan Identitas + Anggaran ke satu Payload
      const payload = {
        ...formData,
        kegiatan_id: Number(subData.kegiatan_id),
        anggaran_list: anggaranList.map(a => ({
          id: a.id, // ID asli dari DB (89, 90, dst) supaya ON DUPLICATE KEY UPDATE jalan
          tahun_id: Number(a.tahun_id),
          target: parseFloat(a.target) || 0,
          pagu: parseInt(a.pagu) || 0
        }))
      };

      console.log("Kirim Payload Komplit:", payload);

      // Tembak ke endpoint Sakti kita (update-all)
      await axiosInstance.put(`/renstra/sub-kegiatan-anggaran/update-all/${subData.id}`, payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data Sub & Anggaran 5 Tahun diperbarui sekaligus.",
        timer: 1500,
        showConfirmButton: false
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Detail Error:", err.response?.data);
      const msg = err.response?.data?.message || "Gagal sinkronisasi data.";
      Swal.fire("Gagal!", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Wallet size={20} /></div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Edit Sub Kegiatan</h3>
              <p className="text-[10px] text-indigo-100 italic">ID Sub: {subData.id} • Mode: Update Komplit</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Identitas Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kodering</label>
              <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={formData.kodering} onChange={(e) => setFormData({ ...formData, kodering: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Sub Kegiatan</label>
              <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={formData.nama_sub} onChange={(e) => setFormData({ ...formData, nama_sub: e.target.value })} />
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Target size={14} /> Matriks Anggaran 5 Tahun
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[9px] text-slate-400 uppercase font-black">
                    <th className="p-2 text-left">Tahun</th>
                    <th className="p-2 text-left">Target</th>
                    <th className="p-2 text-left">Pagu Anggaran (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {anggaranList.map((item, idx) => (
                    <tr key={`edit-ang-${item.tahun}`} className="border-b border-slate-200/50">
                      <td className="p-2 text-xs font-black text-slate-600">{item.tahun}</td>
                      <td className="p-2">
                        <input type="number" step="0.01" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          value={item.target} onChange={(e) => handleAnggaranChange(idx, 'target', e.target.value)} />
                      </td>
                      <td className="p-2">
                        <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600"
                          value={item.pagu} onChange={(e) => handleAnggaranChange(idx, 'pagu', e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase text-[10px] hover:bg-slate-200 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 uppercase text-[10px] hover:bg-indigo-700 transition-all">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}