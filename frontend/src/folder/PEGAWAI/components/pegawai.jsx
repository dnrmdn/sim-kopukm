import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  ArrowLeft, UserPlus, PencilLine, Trash2, GitGraph,
  ChevronRight, ChevronDown, ShieldCheck, Search,
  Users, AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deletePegawai, getPegawai } from "../../../services/pegawaiService";

export default function DaftarPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPegawai = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPegawai();
      setPegawai(response.data.data || []);
    } catch {
      setError("Gagal memuat data pegawai. Silahkan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPegawai(); }, []);

  const childrenMap = useMemo(() => {
    const map = {};
    pegawai.forEach((p) => {
      const isActuallyRoot = (!p.id_atasan || p.id_atasan === "0") && parseInt(p.level) === 1;
      const parentId = isActuallyRoot ? "root" : p.id_atasan || "orphan";
      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(p);
    });
    return map;
  }, [pegawai]);

  const filteredPegawai = useMemo(() => {
    if (!searchQuery.trim()) return pegawai;
    const query = searchQuery.toLowerCase();
    return pegawai.filter(
      (p) =>
        p.nama_lengkap.toLowerCase().includes(query) ||
        p.nip.toLowerCase().includes(query) ||
        p.nama_jabatan.toLowerCase().includes(query)
    );
  }, [pegawai, searchQuery]);

  const pegawaiTanpaAtasan = useMemo(
    () => pegawai.filter((p) => (!p.id_atasan || p.id_atasan === "0") && parseInt(p.level) > 1),
    [pegawai]
  );

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pegawai ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      await deletePegawai(id);
      fetchPegawai();
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan server.");
    }
  };

  // Soft avatar accent colors (light-friendly)
  const getAvatarColor = (index) => {
    const colors = [
      "from-blue-400 to-cyan-300",
      "from-violet-400 to-purple-300",
      "from-amber-400 to-orange-300",
      "from-emerald-400 to-teal-300",
      "from-rose-400 to-pink-300",
    ];
    return colors[index % colors.length];
  };

  const renderPegawaiItem = (item, depth = 0, index = 0) => {
    const children = childrenMap[item.id_pegawai] || [];
    const isExpanded = expandedIds.has(item.id_pegawai);
    const initials = item.nama_lengkap
      .split(" ")
      .filter((n) => n.length > 0)
      .slice(0, 2)
      .map((n) => n[0])
      .join("");

    return (
      <div key={item.id_pegawai} className="w-full">
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .pegawai-card {
            animation: slideInUp 0.4s ease-out both;
            animation-delay: ${depth * 0.05 + index * 0.03}s;
          }
        `}</style>

        <div className="pegawai-card mb-2.5">
          <div className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/70 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
            {/* Decorative orb */}
            <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-15 blur-2xl bg-linear-to-br ${getAvatarColor(index)}`} />

            <div className="relative p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  {children.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(item.id_pegawai)}
                      className="shrink-0 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-200 text-blue-600"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <div className="w-9" />
                  )}

                  {/* Avatar */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl bg-linear-to-br ${getAvatarColor(index)} flex items-center justify-center font-bold text-white text-sm shadow-md`}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                      {item.nama_lengkap}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span className="font-mono">{item.nip}</span>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="sm:inline flex items-center gap-1">
                        <ShieldCheck size={11} className="text-blue-400" />
                        {item.nama_jabatan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    LV {item.level}
                  </span>
                  <button
                    onClick={() => navigate(`/dokumen/pegawai/edit/${item.id_pegawai}`)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-200 text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilLine size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id_pegawai)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200 text-red-500 hover:text-red-700"
                    title="Hapus"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nested children */}
        {isExpanded && children.length > 0 && (
          <div className="ml-3 sm:ml-8 pl-4 sm:pl-6 border-l-2 border-blue-200 flex flex-col gap-1 mt-1 mb-3">
            {children.map((child, idx) => renderPegawaiItem(child, depth + 1, idx))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                      <GitGraph size={20} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Struktur Tim
                    </h1>
                  </div>
                  <p className="text-gray-600 text-sm pl-1">Kelola hierarki organisasi dan data pegawai dengan mudah</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Kembali</span>
                  </button>
                  <button
                    onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                    className="px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 text-white"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Pegawai Baru</span>
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP, atau jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-blue-200 text-gray-700 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Warning Box */}
        {!isLoading && pegawaiTanpaAtasan.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-amber-300 bg-linear-to-br from-amber-50 to-amber-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-amber-200/50">
                  <AlertCircle size={20} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-amber-800 mb-3">Pegawai Belum Memiliki Atasan</h3>
                  <ul className="space-y-2">
                    {pegawaiTanpaAtasan.map((p) => (
                      <li key={p.id_pegawai} className="text-sm text-amber-800 flex items-center justify-between gap-4">
                        <span>
                          <span className="font-semibold">{p.nama_lengkap}</span>
                          <span className="text-amber-600"> ({p.nama_jabatan || "Tanpa Jabatan"})</span>
                        </span>
                        <button
                          onClick={() => navigate(`/dokumen/pegawai/edit/${p.id_pegawai}`)}
                          className="shrink-0 px-3 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-800 font-medium text-xs transition-all duration-200"
                        >
                          Set Atasan
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Box */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-red-200/50">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={fetchPegawai}
                  className="shrink-0 px-3 py-1 rounded-lg bg-red-200/70 hover:bg-red-300 text-red-700 font-medium text-xs transition-all duration-200"
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
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Mengolah data hierarki...</p>
            </div>
          ) : filteredPegawai.length === 0 && searchQuery ? (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
                <Search size={48} className="text-blue-400" />
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">Tidak ada hasil</p>
              <p className="text-gray-600 text-sm mb-6 text-center max-w-sm">Coba ubah pencarian atau tambahkan pegawai baru</p>
              <button
                onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 text-white"
              >
                Tambah Pegawai
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Total Pegawai", value: pegawai.length, icon: Users },
                  { label: "Level Tertinggi", value: pegawai.length > 0 ? Math.max(...pegawai.map((p) => parseInt(p.level))) : 0, icon: GitGraph },
                  { label: "Hasil Pencarian", value: filteredPegawai.length, icon: Search },
                  { label: "Manager", value: pegawai.filter((p) => parseInt(p.level) <= 2).length, icon: ShieldCheck },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Organization tree */}
              {!childrenMap["root"] ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-3xl bg-linear-to-br from-blue-100/30 to-cyan-100/30">
                  <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
                    <Users size={48} className="text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 mb-2">Data Pegawai Kosong</p>
                  <p className="text-gray-600 text-sm mb-6 text-center max-w-sm">
                    Silahkan tambahkan pegawai dengan level tertinggi (tanpa atasan) terlebih dahulu.
                  </p>
                  <button
                    onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                    className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 text-white"
                  >
                    Tambah Sekarang
                  </button>
                </div>
              ) : (
                childrenMap["root"].map((rootPegawai, idx) => renderPegawaiItem(rootPegawai, 0, idx))
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-white/40 border-t border-blue-200/50 mt-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total Pegawai: {pegawai.length}</span>
                <span>Struktur Hirarki Aktif</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}