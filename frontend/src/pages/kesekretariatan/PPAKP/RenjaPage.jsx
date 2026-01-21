// src/pages/RenjaPage.jsx
import React, { useEffect, useState } from "react";
import {
  FileText,
  Edit2,
  Trash2,
  UploadCloud,
  Plus,
  XCircle,
} from "lucide-react";
import axios from "axios";
import FilePreviewModal from "@/components/kesekretariatan/FilePreviewModal";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:4849", // ganti sesuai server kamu
});

export default function RenjaPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");
  const [error, setError] = useState("");

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
      } else {
        setFiles([]);
      }
    } catch (e) {
      console.error(e);
      setError("Gagal memuat daftar dokumen Renja.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  const buildFileUrl = (filePath) => {
    if (!filePath) return null;
    const base = api.defaults.baseURL.replace(/\/$/, "");
    return filePath.startsWith("/") ? `${base}${filePath}` : `${base}/${filePath}`;
  };

  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: file.mime,
      url: buildFileUrl(file.path),
    });
    setPreviewOpen(true);
  };

  const handleEdit = async (file) => {
    const newName = prompt("Ubah nama dokumen:", file.name);
    if (!newName?.trim()) return;
    try {
      const res = await api.put(endpoints.update(file.id), { name: newName });
      if (res.data?.success) {
        setFiles((p) => p.map((f) => (f.id === file.id ? res.data.data : f)));
      } else {
        alert("Gagal mengubah nama.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal mengubah nama (server).");
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Hapus dokumen "${file.name}"?`)) return;
    try {
      const res = await api.delete(endpoints.remove(file.id));
      if (res.data?.success) {
        setFiles((p) => p.filter((f) => f.id !== file.id));
      } else {
        alert("Gagal menghapus dokumen.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus dokumen (server).");
    }
  };

  const MAX_FILE_BYTES = 25 * 1024 * 1024;
  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > MAX_FILE_BYTES) {
      alert("Ukuran file terlalu besar (maks 25MB).");
      e.target.value = "";
      return;
    }
    setUploadingFile(f);
    setUploadingName(f ? f.name : "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadingFile) return alert("Pilih file terlebih dahulu.");

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName);

    try {
      const res = await api.post(endpoints.upload, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        setFiles((p) => [res.data.data, ...p]);
        setUploadingFile(null);
        setUploadingName("");
        document.getElementById("renja-upload-input").value = "";
      } else {
        alert("Upload gagal.");
      }
    } catch (e) {
      console.error(e);
      alert("Upload gagal (server).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* HEADER */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Dokumen Rencana Kerja (Renja)
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Upload dan kelola dokumen Rencana Kerja Dinas
          </p>
        </header>

        {/* UPLOAD SECTION DI ATAS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-1">
            <UploadCloud className="w-5 h-5 text-sky-600" />
            Upload Dokumen Renja
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Upload dokumen Rencana Kerja (PDF/DOC/JPG/PNG)
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <input
                id="renja-upload-input"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="md:col-span-2 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-slate-100 file:font-semibold"
              />
              <input
                type="text"
                placeholder="Nama dokumen (opsional)"
                value={uploadingName}
                onChange={(e) => setUploadingName(e.target.value)}
                className="border border-slate-200 rounded-lg p-2"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
            >
              <Plus className="w-4 h-4" />
              Upload
            </button>
          </form>
        </section>

        {/* LIST DOKUMEN DI BAWAH */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-lg font-bold text-slate-700">Dokumen Renja</h2>
            </div>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">
              {files.length} Dokumen
            </span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 font-semibold">
              <XCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-slate-500">Memuat data dokumen…</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3 text-left">Nama Dokumen</th>
                  <th className="py-3 w-40 text-left">Tanggal</th>
                  <th className="py-3 w-56 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="font-semibold text-slate-700">{file.name}</div>
                      <div className="text-xs text-slate-500">{file.mime || "-"}</div>
                    </td>
                    <td className="py-3 text-slate-600">{(file.created_at || "").slice(0, 10)}</td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => handleEdit(file)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      Belum ada dokumen.
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
