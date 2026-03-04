import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import FilePreviewModal from "@/LAYOUTS/FilePreviewModal";

// ================= AXIOS =================
const api = axios.create({
  baseURL: "http://localhost:4849",
});

// ================= COMPONENT =================
export default function LhpPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");

  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // ================= ENDPOINT =================
  const endpoints = {
    list: "/api/lhp",
    upload: "/api/lhp/upload",
    detail: (id) => `/api/lhp/${id}`,
    update: (id) => `/api/lhp/${id}`,
    remove: (id) => `/api/lhp/${id}`,
  };

  // ================= FETCH LIST =================
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoints.list);
      if (res.data?.success) {
        setFiles(res.data.data || []);
        setFilteredFiles(res.data.data || []);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal mengambil data LHP");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredFiles(files);
      return;
    }
    const key = search.toLowerCase();
    setFilteredFiles(files.filter((f) => f.name?.toLowerCase().includes(key)));
  };

  const handleReset = () => {
    setSearch("");
    setFilteredFiles(files);
  };

  // ================= PREVIEW =================
  const detectMime = (file) => {
    if (file.mime) return file.mime;
    const n = file.name?.toLowerCase() || "";
    if (n.endsWith(".pdf")) return "application/pdf";
    if (n.endsWith(".png")) return "image/png";
    if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
    if (n.endsWith(".doc")) return "application/msword";
    if (n.endsWith(".docx"))
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    return "application/octet-stream";
  };

  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: detectMime(file),
      url: `${api.defaults.baseURL}${endpoints.detail(file.id)}`,
    });
    setPreviewOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = async (file) => {
    const name = prompt("Ubah nama dokumen:", file.name);
    if (!name?.trim()) return;

    try {
      const res = await api.put(endpoints.update(file.id), { name });
      if (res.data?.success) {
        setFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
        setFilteredFiles((p) =>
          p.map((f) => (f.id === file.id ? res.data.data : f))
        );
      }
    } catch (e) {
      console.error(e);
      alert("Gagal mengubah dokumen");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (file) => {
    if (!confirm(`Hapus dokumen "${file.name}"?`)) return;

    try {
      const res = await api.delete(endpoints.remove(file.id));
      if (res.data?.success) {
        setFiles((p) => p.filter((f) => f.id !== file.id));
        setFilteredFiles((p) => p.filter((f) => f.id !== file.id));
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus dokumen");
    }
  };

  // ================= UPLOAD =================
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setUploadingFile(f || null);
    setUploadingName(f?.name || "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadingFile) return alert("Pilih file dulu");

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName);

    try {
      const res = await api.post(endpoints.upload, fd);
      if (res.data?.success) {
        setFiles((p) => [res.data.data, ...p]);
        setFilteredFiles((p) => [res.data.data, ...p]);
        setUploadingFile(null);
        setUploadingName("");
        document.getElementById("lhp-upload").value = "";
      }
    } catch (e) {
      console.error(e);
      alert("Upload gagal");
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <header className="bg-white p-6 rounded-xl shadow text-center">
          <h1 className="text-3xl font-bold">📕 Dokumen LHP</h1>
          <p className="text-slate-500">Laporan Hasil Pemeriksaan</p>
        </header>

        {/* UPLOAD */}
        <section className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-3">
            <input
              id="lhp-upload"
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Nama dokumen"
              value={uploadingName}
              onChange={(e) => setUploadingName(e.target.value)}
              className="border p-2 rounded"
            />
            <button className="bg-emerald-600 text-white rounded flex items-center justify-center gap-1">
              <Plus size={16} /> Upload
            </button>
          </form>
        </section>

        {/* TABLE */}
        <section className="bg-white p-6 rounded-xl shadow">
          {loading ? (
            <div className="text-center">Memuat data…</div>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-center">Tanggal</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="p-2">{f.name}</td>
                    <td className="p-2 text-center">
                      {String(f.created_at).slice(0, 10)}
                    </td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => handlePreview(f)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => handleEdit(f)}
                        className="bg-amber-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
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