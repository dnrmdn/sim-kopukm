import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { X, Upload, FileText } from "lucide-react";

export default function AddDokumenModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ nama_dokumen: ""});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return Swal.fire("Error", "Pilih file terlebih dahulu", "error");

  const data = new FormData();
  data.append("nama_dokumen", formData.nama_dokumen);
  // Hapus baris di bawah ini:
  // data.append("uploaded_by", formData.uploaded_by); 
  data.append("file", file);

  setLoading(true);
  try {
    await axiosInstance.post("/renstra/dokumen/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    Swal.fire("Berhasil!", "Dokumen berhasil diupload.", "success");
    onSuccess();
    onClose();
    setFormData({ nama_dokumen: "" }); // Sesuaikan state-nya
    setFile(null);
  } catch (err) {
    Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
  } finally {
    setLoading(false);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-lg shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black uppercase tracking-tighter text-slate-800">Upload Dokumen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nama Dokumen</label>
            <input 
              required
              className="w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nama_dokumen}
              onChange={(e) => setFormData({...formData, nama_dokumen: e.target.value})}
            />
          </div>

         

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">File Dokumen</label>
            <div className="border-2 border-dashed border-slate-200 p-4 text-center rounded-sm hover:border-blue-500 transition-colors cursor-pointer">
              <input 
                type="file" 
                id="fileInput"
                className="hidden" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500">
                  {file ? file.name : "Klik untuk pilih file"}
                </span>
              </label>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white font-black uppercase text-[11px] rounded-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Dokumen"}
          </button>
        </form>
      </div>
    </div>
  );
}