import React, { useEffect, useState, useMemo } from "react";
import { PlusCircle, ArrowLeft, PencilLine, Trash2, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteJabatan, getAllJabatan } from "@/services/jabatanService";

export default function DaftarJabatan() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchJabatan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllJabatan();
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setError("Gagal memuat data jabatan. Silahkan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) => item.nama_jabatan.toLowerCase().includes(query));
  }, [data, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jabatan ini?")) return;
    try {
      await deleteJabatan(id);
      fetchJabatan();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Gagal menghapus data";
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-blue-500" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-slate-900/40 border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col gap-6">
              {/* Title section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                    Daftar Jabatan
                  </h1>
                  <p className="text-slate-400 text-sm">Kelola data jabatan dan posisi di organisasi</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Kembali</span>
                  </button>
                  <button
                    onClick={() => navigate("/dokumen/jabatan/create-jabatan-page")}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span className="hidden sm:inline">Tambah Jabatan</span>
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/20">
                  <AlertCircle size={20} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-100">{error}</p>
                </div>
                <button
                  onClick={() => fetchJabatan()}
                  className="flex-shrink-0 px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-100 font-medium text-xs transition-all duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">Memuat data jabatan...</p>
            </div>
          ) : filteredData.length === 0 && searchQuery ? (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
                <Search size={48} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">Tidak ada hasil</p>
              <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
                Coba ubah pencarian atau tambahkan jabatan baru
              </p>
              <button
                onClick={() => navigate("/dokumen/jabatan/create-jabatan-page")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Tambah Jabatan
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-gradient-to-br from-slate-800/20 to-slate-700/10">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
                <Search size={48} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">Data Jabatan Kosong</p>
              <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
                Silahkan tambahkan jabatan baru untuk memulai
              </p>
              <button
                onClick={() => navigate("/dokumen/jabatan/create-jabatan-page")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Tambah Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Stats */}
              <div className="mb-8">
                <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-300">
                      <PlusCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Total Jabatan</p>
                      <p className="text-2xl font-bold text-white">{data.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full">
                  {/* Table Head */}
                  <thead>
                    <tr className="bg-slate-900/60 backdrop-blur-sm border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide w-12">No</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Nama Jabatan</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wide w-32">Aksi</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr
                        key={item.id_jabatan}
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 text-sm text-slate-300 font-mono">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-white font-medium group-hover:text-cyan-100 transition-colors">
                          {item.nama_jabatan}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/dokumen/jabatan/edit/${item.id_jabatan}`)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 transition-all duration-200 text-white hover:text-blue-100"
                              title="Edit"
                            >
                              <PencilLine size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id_jabatan)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 transition-all duration-200 text-white hover:text-red-100"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table info */}
              <div className="text-xs text-slate-400 text-center mt-4">
                Menampilkan {filteredData.length} dari {data.length} jabatan
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-slate-900/40 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total Jabatan: {data.length}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}