import React, { useEffect, useState, useCallback } from "react";
import {
  PencilLine,
  Trash2,
  Plus,
  Search,
  Eye,
  FileText,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FilePreviewModal from "@/LAYOUTS/FilePreviewModal";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:4849",
});

export default function SpipPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");
  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const endpoints = {
    list: "/api/dokumen/spip",
    upload: "/api/dokumen/spip/upload",
    update: (id) => `/api/dokumen/spip/${id}`,
    remove: (id) => `/api/dokumen/spip/${id}`,
  };

  // ================= FETCH LIST =================
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(endpoints.list);
      if (res.data?.success) {
        setFiles(res.data.data || []);
        setFilteredFiles(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data SPIP");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ================= SEARCH =================
  const handleSearch = (query) => {
    setSearch(query);
    if (!query.trim()) {
      setFilteredFiles(files);
      return;
    }
    const keyword = query.toLowerCase();
    setFilteredFiles(
      files.filter((f) => f.name?.toLowerCase().includes(keyword))
    );
  };

  // ================= PREVIEW =================
  const detectMime = (file) => {
    if (file.mime) return file.mime;
    const name = file.name?.toLowerCase() || "";
    if (name.endsWith(".pdf")) return "application/pdf";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
    if (name.endsWith(".png")) return "image/png";
    if (name.endsWith(".doc")) return "application/msword";
    if (name.endsWith(".docx"))
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    return "application/octet-stream";
  };

  const buildFileUrl = (file) => {
    if (!file?.id) return null;
    return `${api.defaults.baseURL}/api/dokumen/spip/${file.id}`;
  };

  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: detectMime(file),
      url: buildFileUrl(file),
    });
    setPreviewOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = async (file) => {
    const newName = prompt("Ubah nama dokumen:", file.name);
    if (!newName || !newName.trim()) return;

    try {
      const res = await api.put(endpoints.update(file.id), { name: newName.trim() });
      if (res.data?.success) {
        setFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
        setFilteredFiles((p) =>
          p.map((f) => (f.id === file.id ? res.data.data : f))
        );
        alert("Dokumen berhasil diubah");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengubah dokumen");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (file) => {
    if (!window.confirm(`Hapus dokumen "${file.name}"?`)) return;

    try {
      const res = await api.delete(endpoints.remove(file.id));
      if (res.data?.success) {
        setFiles((p) => p.filter((f) => f.id !== file.id));
        setFilteredFiles((p) => p.filter((f) => f.id !== file.id));
        alert("Dokumen berhasil dihapus");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menghapus dokumen");
    }
  };

  // ================= UPLOAD =================
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setUploadingFile(f || null);
    setUploadingName(f?.name?.replace(/\.[^/.]+$/, "") || "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadingFile) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    if (!uploadingName.trim()) {
      alert("Masukkan nama dokumen");
      return;
    }

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName.trim());

    try {
      setIsUploading(true);
      const res = await api.post(endpoints.upload, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setFiles((p) => [res.data.data, ...p]);
        setFilteredFiles((p) => [res.data.data, ...p]);
        setUploadingFile(null);
        setUploadingName("");

        const fileInput = document.getElementById("spip-upload-input");
        if (fileInput) fileInput.value = "";

        alert("File berhasil diupload");
      } else {
        alert(res.data?.message || "Gagal upload");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  // ================= RENDER =================
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
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Kembali</span>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/30">
                  <FileText size={24} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Dokumen SPIP
                </h1>
              </div>
              <p className="text-slate-400 text-sm">
                Sistem Pengendalian Internal Pemerintah - Kelola dokumen dengan mudah
              </p>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-500/30 bg-linear-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg flex items-center gap-4">
              <div className="shrink-0 p-2 rounded-lg bg-red-500/20">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-100">{error}</p>
              </div>
              <button
                onClick={() => fetchList()}
                className="shrink-0 px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-100 font-medium text-xs transition-all duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          {/* Upload Section */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl">
            {/* Decorative orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-blue-500 to-cyan-300" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-purple-500 to-pink-300" />

            <div className="relative p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">📤 Upload Dokumen</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* File Input */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Pilih File
                    </label>
                    <input
                      id="spip-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="block w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400 cursor-pointer hover:bg-white/20 transition-all duration-200"
                    />
                    {uploadingFile && (
                      <p className="text-xs text-cyan-300 mt-2">✓ {uploadingFile.name}</p>
                    )}
                  </div>

                  {/* Name Input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Nama Dokumen
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dokumen SPIP Tahun 2024"
                      value={uploadingName}
                      onChange={(e) => setUploadingName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                    />
                  </div>

                  {/* Upload Button */}
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-white disabled:shadow-none"
                    >
                      <Plus size={16} />
                      {isUploading ? "Upload..." : "Upload"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Search Section */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama dokumen..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
            />
          </div>

          {/* Documents Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">Memuat dokumen...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-linear-to-br from-slate-800/20 to-slate-700/10">
              <FileText size={48} className="text-slate-500 mb-4" />
              <p className="text-xl font-bold text-white mb-2">Tidak ada dokumen</p>
              <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
                {search ? "Coba ubah pencarian" : "Upload dokumen SPIP pertama Anda sekarang"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-900/60 backdrop-blur-sm border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">
                      Nama Dokumen
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wide">
                      Tanggal Upload
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wide">
                      Aksi
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                            <FileText size={18} className="text-cyan-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-cyan-100 transition-colors">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">ID: {file.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-300">
                          {new Date(file.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handlePreview(file)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 transition-all duration-200 text-white hover:text-blue-100"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(file)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-amber-500/30 transition-all duration-200 text-white hover:text-amber-100"
                            title="Edit"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(file)}
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
          )}

          {/* Stats */}
          {filteredFiles.length > 0 && (
            <div className="text-xs text-slate-400 text-center">
              Menampilkan {filteredFiles.length} dari {files.length} dokumen
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-slate-900/40 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total Dokumen: {files.length}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}