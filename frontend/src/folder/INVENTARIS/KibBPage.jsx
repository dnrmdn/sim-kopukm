import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, RefreshCw, Trash2, Edit3, Eye, Printer } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import AddKibBModal from "./components/AddKibBModal";

export default function KibBPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/kib-b");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/kib-b/${id}`);
          Swal.fire("Terhapus!", "Data telah dihapus.", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Gagal!", "Gagal menghapus data.", "error");
        }
      }
    });
  };

  const filteredData = data.filter(item => 
    item.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode_barang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">KIB B</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Kartu Inventaris Barang (Peralatan dan Mesin)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={20} />
            Tambah Data
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 w-full max-w-md bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={20} className="text-slate-400" />
          <input 
            placeholder="Cari nama barang atau kode..." 
            className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors" title="Refresh">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors" title="Filter">
            <Filter size={20} />
          </button>
          <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors" title="Cetak">
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider w-16">No</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider w-40">Kode Barang</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Nama Barang</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Merk / Type</th>
                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Tahun</th>
                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Harga (Rp)</th>
                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Kondisi</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50 shadow-l">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400 font-medium">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400 font-medium">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600 bg-indigo-50/30 rounded-r-xl">{item.kode_barang}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.nama_barang}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.merk_type}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-500 bg-slate-50/50 rounded-lg">{item.tahun_perolehan}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">{Number(item.harga).toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                        item.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-600' :
                        item.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-600' :
                        'bg-rose-100 text-rose-600'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic truncate max-w-xs">{item.keterangan || "-"}</td>
                    <td className="px-6 py-4 sticky right-0 bg-white shadow-l">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Detail">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium text-center">
          Menampilkan {filteredData.length} data
        </div>
      </div>

      <AddKibBModal open={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchData} />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
