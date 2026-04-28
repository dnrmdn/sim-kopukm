import React from "react";
import { 
  FileText, Download, Trash2, User, Calendar, 
  FileSpreadsheet, FileImage, File 
} from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/axiosInstance";

export default function CardDokumen({ data, onSuccess }) {
  
  // Fungsi untuk menentukan ikon berdasarkan ekstensi file
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(ext)) return { icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50" };
    if (ext === 'pdf') return { icon: FileText, color: "text-rose-600", bg: "bg-rose-50" };
    if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) return { icon: FileImage, color: "text-purple-600", bg: "bg-purple-50" };
    return { icon: File, color: "text-slate-500", bg: "bg-slate-100" };
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Dokumen?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus"
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/renstra/dokumen/${id}`);
        Swal.fire("Terhapus!", "", "success");
        onSuccess();
      } catch (err) {
        Swal.fire("Gagal", "Tidak dapat menghapus dokumen", "error");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((doc) => {
        const { icon: FileIcon, color, bg } = getFileIcon(doc.file_path);
        
        return (
          <div key={doc.id} className="bg-white border border-slate-200 p-4 rounded-sm hover:shadow-sm transition-all flex flex-col gap-4">
            
            {/* BAGIAN ATAS: LOGO - NAMA - DOWNLOAD */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-sm ${bg} ${color}`}>
                <FileIcon size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-tight truncate" title={doc.nama_dokumen}>
                  {doc.nama_dokumen}
                </h4>
              </div>

              <a 
                href={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL}/${doc.file_path.replace(/\\/g, '/')}`}
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                title="Download"
              >
                <Download size={16} />
              </a>
              
              <button 
                onClick={() => handleDelete(doc.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* BAGIAN BAWAH: TANGGAL & UPLOADER */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <Calendar size={11} />
                <span>{new Date(doc.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded">
                <User size={11} />
                <span>{doc.nama_uploader}</span>
              </div>
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          Belum ada dokumen
        </div>
      )}
    </div>
  );
}