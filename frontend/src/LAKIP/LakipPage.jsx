import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import axios from "axios";
import FilePreviewModal from "@/components/kesekretariatan/FilePreviewModal";

const api = axios.create({
  baseURL: "http://localhost:4849",
});

export default function LakipPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingName, setUploadingName] = useState("");
  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // 🔹 DATA REKAP
  const rekapLakip = [
    { tahun: 2021, q1: false, q2: false, q3: false, q4: false, tahunan: true },
    { tahun: 2022, q1: false, q2: false, q3: false, q4: false, tahunan: true },
    { tahun: 2023, q1: false, q2: false, q3: false, q4: false, tahunan: true },
    { tahun: 2024, q1: false, q2: false, q3: false, q4: false, tahunan: true },
    { tahun: 2025, q1: true, q2: true, q3: true, q4: true, tahunan: true },
    { tahun: 2026, q1: false, q2: false, q3: false, q4: false, tahunan: false },
  ];

  const endpoints = {
    list: "/api/dokumen/lakip",
    upload: "/api/dokumen/lakip/upload",
    update: (id) => `/api/dokumen/lakip/${id}`,
    remove: (id) => `/api/dokumen/lakip/${id}`,
  };

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    const res = await api.get(endpoints.list);
    if (res.data?.success) {
      setFiles(res.data.data);
      setFilteredFiles(res.data.data);
    }
    setLoading(false);
  }

  const handleSearch = () => {
    if (!search.trim()) return setFilteredFiles(files);
    const key = search.toLowerCase();
    setFilteredFiles(files.filter((f) => f.name.toLowerCase().includes(key)));
  };

  const handleReset = () => {
    setSearch("");
    setFilteredFiles(files);
  };

  const buildFileUrl = (file) =>
    `${api.defaults.baseURL}/api/dokumen/lakip/${file.id}`;

  const handlePreview = (file) => {
    setPreviewFile({
      name: file.name,
      mime: file.mime,
      url: buildFileUrl(file),
    });
    setPreviewOpen(true);
  };

  const handleEdit = async (file) => {
    const newName = prompt("Ubah nama dokumen:", file.name);
    if (!newName) return;
    await api.put(endpoints.update(file.id), { name: newName });
    fetchList();
  };

  const handleDelete = async (file) => {
    if (!confirm(`Hapus "${file.name}"?`)) return;
    await api.delete(endpoints.remove(file.id));
    fetchList();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadingFile) return alert("Pilih file!");

    const fd = new FormData();
    fd.append("file", uploadingFile);
    fd.append("title", uploadingName);

    const res = await api.post(endpoints.upload, fd);
    if (res.data?.success) {
      setUploadingFile(null);
      setUploadingName("");
      document.getElementById("lakip-upload").value = "";
      fetchList();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h1 className="text-3xl font-black">📊 Dokumen LAKIP</h1>
          <p className="text-slate-500">
            Laporan Akuntabilitas Kinerja Instansi
          </p>
        </div>

        {/* 🔹 REKAPITULASI LAKIP */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-center">
            Rekapitulasi Dokumen LAKIP
          </h2>
          <p className="text-center text-slate-500 text-sm mb-4">
            Cek status kelengkapan per tahun (Triwulan I–IV & Tahunan)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden text-sm">
              <thead className="bg-blue-100 text-center">
                <tr>
                  <th className="p-2">Tahun</th>
                  <th className="p-2">Triwulan I</th>
                  <th className="p-2">Triwulan II</th>
                  <th className="p-2">Triwulan III</th>
                  <th className="p-2">Triwulan IV</th>
                  <th className="p-2">Tahunan</th>
                </tr>
              </thead>
              <tbody>
                {rekapLakip.map((r) => (
                  <tr key={r.tahun} className="border-b text-center">
                    <td className="p-2 font-semibold">{r.tahun}</td>
                    <td>{r.q1 ? "✅" : "❌"}</td>
                    <td>{r.q2 ? "✅" : "❌"}</td>
                    <td>{r.q3 ? "✅" : "❌"}</td>
                    <td>{r.q4 ? "✅" : "❌"}</td>
                    <td>{r.tahunan ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPLOAD */}
        <div className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-3">
            <input
              id="lakip-upload"
              type="file"
              onChange={(e) => {
                setUploadingFile(e.target.files[0]);
                setUploadingName(e.target.files[0]?.name || "");
              }}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Nama dokumen"
              value={uploadingName}
              onChange={(e) => setUploadingName(e.target.value)}
              className="border rounded p-2"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1 px-4 py-2 shadow">
              <Plus size={16} /> Upload
            </button>
          </form>
        </div>

        {/* LIST DOKUMEN */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex gap-2 mb-4">
            <input
              className="border p-2 rounded flex-1"
              placeholder="Cari dokumen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded flex items-center justify-center"
            >
              <Search size={16} />
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-200 hover:bg-slate-300 px-4 rounded flex items-center justify-center"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Memuat...</div>
          ) : (
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-semibold">{f.name}</td>
                    <td className="p-3 text-center">
                      {f.created_at.slice(0, 10)}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handlePreview(f)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs shadow"
                      >
                        <Eye size={14} /> Lihat
                      </button>
                      <button
                        onClick={() => handleEdit(f)}
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs shadow"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs shadow"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}
