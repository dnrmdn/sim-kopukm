import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Plus,
  Search,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import FilePreviewModal from "@/components/kesekretariatan/FilePreviewModal";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:4849",
});

export default function LppdPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");

  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const endpoints = {
    list: "/api/lppd",
    upload: "/api/lppd/upload",
    update: (id) => `/api/lppd/${id}`,
    remove: (id) => `/api/lppd/${id}`,
    preview: (id) => `/api/lppd/${id}`,
  };

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    try {
      setLoading(true);
      const res = await api.get(endpoints.list);
      if (res.data?.success) {
        setFiles(res.data.data || []);
        setFilteredFiles(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredFiles(files);
      return;
    }
    const keyword = search.toLowerCase();
    setFilteredFiles(
      files.filter((f) => f.name?.toLowerCase().includes(keyword))
    );
  };

  const handleReset = () => {
    setSearch("");
    setFilteredFiles(files);
  };

  /* ================= PREVIEW ================= */
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

  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: detectMime(file),
      url: `${api.defaults.baseURL}${endpoints.preview(file.id)}`,
    });
    setPreviewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = async (file) => {
    const newName = prompt("Ubah nama dokumen:", file.name);
    if (!newName?.trim()) return;

    try {
      const res = await api.put(endpoints.update(file.id), { name: newName });
      if (res.data?.success) {
        setFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
        setFilteredFiles((p) =>
          p.map((f) => (f.id === file.id ? res.data.data : f))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah dokumen");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (file) => {
    if (!window.confirm(`Hapus dokumen "${file.name}"?`)) return;

    try {
      const res = await api.delete(endpoints.remove(file.id));
      if (res.data?.success) {
        setFiles((p) => p.filter((f) => f.id !== file.id));
        setFilteredFiles((p) => p.filter((f) => f.id !== file.id));
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus dokumen");
    }
  };

  /* ================= UPLOAD ================= */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setUploadingFile(f);
    setUploadingName(f?.name || "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadingFile) return alert("Pilih file terlebih dahulu");

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName);

    try {
      const res = await api.post(endpoints.upload, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setFiles((p) => [res.data.data, ...p]);
        setFilteredFiles((p) => [res.data.data, ...p]);
        setUploadingFile(null);
        setUploadingName("");
        document.getElementById("lppd-upload-input").value = "";
      } else {
        alert(res.data?.message || "Upload gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* HEADER */}
        <header className="bg-white p-6 rounded-2xl shadow border text-center">
          <h1 className="text-3xl font-black text-slate-800">
            📗 Dokumen LPPD
          </h1>
          <p className="text-slate-500 mt-2">
            Laporan Penyelenggaraan Pemerintahan Daerah
          </p>
        </header>

        {/* UPLOAD */}
        <section className="bg-white p-6 rounded-2xl shadow border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <UploadCloud className="text-sky-600" />
            Upload Dokumen LPPD
          </h3>

          <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-3">
            <input
              id="lppd-upload-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Nama dokumen LPPD"
              value={uploadingName}
              onChange={(e) => setUploadingName(e.target.value)}
              className="border p-2 rounded-lg"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-1 shadow">
              <Plus className="w-4 h-4" />
              Upload
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Cari dokumen LPPD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border p-2 rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-200 px-4 py-2 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
              📄 {filteredFiles.length} / {files.length} dokumen
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6">Memuat data…</div>
          ) : (
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Nama Dokumen</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-semibold">{file.name}</td>
                    <td className="p-3 text-center">
                      {(file.created_at || "").slice(0, 10)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePreview(file)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs"
                        >
                          Lihat
                        </button>
                        <button
                          onClick={() => handleEdit(file)}
                          className="px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-6 text-slate-500">
                      Tidak ada dokumen LPPD
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
