// src/pages/RenjaPage.jsx
import React, { useEffect, useState } from "react";
import {
  FileText,
  Edit2,
  Trash2,
  UploadCloud,
  Plus,
  XCircle,
  Search,
  RotateCcw,
  Eye,
} from "lucide-react";
import axios from "axios";
import FilePreviewModal from "@/components/kesekretariatan/FilePreviewModal";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:4849",
});

export default function RenjaPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const endpoints = {
    list: "/api/dokumen/renja",
    upload: "/api/dokumen/renja/upload",
    update: (id) => `/api/dokumen/renja/${id}`,
    remove: (id) => `/api/dokumen/renja/${id}`,
  };

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(endpoints.list);
      if (res.data?.success) {
        setFiles(res.data.data || []);
        setFilteredFiles(res.data.data || []);
      }
    } catch (e) {
      console.error(e);
      setError("Gagal memuat dokumen Renja");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    if (!search.trim()) return setFilteredFiles(files);
    const keyword = search.toLowerCase();
    setFilteredFiles(files.filter((f) => f.name?.toLowerCase().includes(keyword)));
  };

  const handleReset = () => {
    setSearch("");
    setFilteredFiles(files);
  };

  const buildFileUrl = (filePath) => {
    if (!filePath) return null;
    const base = api.defaults.baseURL.replace(/\/$/, "");
    return filePath.startsWith("/") ? `${base}${filePath}` : `${base}/${filePath}`;
  };

  const detectMime = (file) => {
    if (file.mime) return file.mime;
    const name = file.name?.toLowerCase() || "";
    if (name.endsWith(".pdf")) return "application/pdf";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
    if (name.endsWith(".png")) return "image/png";
    if (name.endsWith(".doc")) return "application/msword";
    if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    return "application/octet-stream";
  };
  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: detectMime(file),
      url: `${api.defaults.baseURL}/api/dokumen/renja/${file.id}`,
    });
    setPreviewOpen(true);
  };

  const handleEdit = async (file) => {
    const newName = prompt("Ubah nama dokumen:", file.name);
    if (!newName?.trim()) return;
    const res = await api.put(endpoints.update(file.id), { name: newName });
    if (res.data?.success) {
      setFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
      setFilteredFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
    }
  };

  const handleDelete = async (file) => {
    if (!confirm(`Hapus dokumen "${file.name}" ?`)) return;
    const res = await api.delete(endpoints.remove(file.id));
    if (res.data?.success) {
      setFiles((p) => p.filter((f) => f.id !== file.id));
      setFilteredFiles((p) => p.filter((f) => f.id !== file.id));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setUploadingFile(f);
    setUploadingName(f?.name || "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadingFile) return alert("Pilih file dulu");

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName);

    const res = await api.post(endpoints.upload, fd);
    if (res.data?.success) {
      setFiles((p) => [res.data.data, ...p]);
      setFilteredFiles((p) => [res.data.data, ...p]);
      setUploadingFile(null);
      setUploadingName("");
      document.getElementById("renja-upload-input").value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">

        {/* HEADER */}
        <header className="bg-white p-6 rounded-2xl shadow border text-center">
          <h1 className="text-3xl font-black text-slate-800">
            📂 Dokumen Rencana Kerja (Renja)
          </h1>
          <p className="text-slate-500 mt-2">Dinas Koperasi dan Usaha Kecil Menengah</p>
        </header>

        {/* UPLOAD */}
        <section className="bg-white p-6 rounded-2xl shadow border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <UploadCloud className="text-sky-600" /> Upload Dokumen
          </h3>

          <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-3">
            <input
              id="renja-upload-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Nama dokumen"
              value={uploadingName}
              onChange={(e) => setUploadingName(e.target.value)}
              className="border p-2 rounded-lg"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-1 shadow">
              <Plus className="w-4 h-4" /> Upload
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="bg-white p-6 rounded-2xl shadow border">

          {/* SEARCH + JUMLAH */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border p-2 rounded-lg"
              />
              <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1">
                <Search className="w-4 h-4" /> Cari
              </button>
              <button onClick={handleReset} className="bg-slate-200 px-4 py-2 rounded-lg flex items-center gap-1">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            {/* JUMLAH DOKUMEN */}
            <div className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
              📄 Menampilkan {filteredFiles.length} dari {files.length} dokumen
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6">Memuat...</div>
          ) : (
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Nama Dokumen</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold">{file.name}</td>
                    <td className="p-3 text-center text-slate-600">
                      {(file.created_at || "").slice(0, 10)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handlePreview(file)} className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">Lihat</button>
                        <button onClick={() => handleEdit(file)} className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(file)} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-6 text-slate-500">
                      Tidak ada dokumen
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}
