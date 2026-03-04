import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ArrowLeft, UserPlus, PencilLine, Trash2, GitGraph, ChevronRight, ChevronDown, ShieldCheck, Search, Users, AlertCircle } from "lucide-react";
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
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
      setError("Gagal memuat data pegawai. Silahkan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // OPTIMIZATION: Map children by parent ID once
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
    return pegawai.filter((p) => p.nama_lengkap.toLowerCase().includes(query) || p.nip.toLowerCase().includes(query) || p.nama_jabatan.toLowerCase().includes(query));
  }, [pegawai, searchQuery]);

  const pegawaiTanpaAtasan = useMemo(() => {
    return pegawai.filter((p) => (!p.id_atasan || p.id_atasan === "0") && parseInt(p.level) > 1);
  }, [pegawai]);

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
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Terjadi kesalahan server.");
      }
    }
  };

  const getAvatarColor = (index) => {
    const colors = ["from-blue-400 to-cyan-300", "from-purple-400 to-pink-300", "from-amber-400 to-orange-300", "from-emerald-400 to-teal-300", "from-rose-400 to-red-300"];
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
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .pegawai-card {
            animation: slideInUp 0.5s ease-out;
            animation-delay: ${depth * 0.05 + index * 0.03}s;
          }
          .pegawai-card:hover {
            transform: translateY(-4px);
          }
        `}</style>

        <div className="pegawai-card mb-3 transition-all duration-300">
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/40 ${depth === 0 ? "from-slate-900/40 to-slate-800/30" : "from-slate-800/40 to-slate-700/20"}`}
          >
            {/* Decorative gradient orb */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl bg-gradient-to-br ${getAvatarColor(index)}`} />

            <div className="relative p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                {/* Left section */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Expansion button */}
                  {children.length > 0 ? (
                    <button onClick={() => toggleExpand(item.id_pegawai)} className="flex-shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                  ) : (
                    <div className="w-10" />
                  )}

                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center font-bold text-white text-sm shadow-lg`}>{initials}</div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate uppercase tracking-wide">{item.nama_lengkap}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                      <span className="font-mono">{item.nip}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline flex items-center gap-1">
                        <ShieldCheck size={12} className="text-cyan-300" /> {item.nama_jabatan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Level badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm">LV {item.level}</span>

                  {/* Actions */}
                  <button onClick={() => navigate(`/dokumen/pegawai/edit/${item.id_pegawai}`)} className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 transition-all duration-200 text-white hover:text-blue-100">
                    <PencilLine size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id_pegawai)} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 transition-all duration-200 text-white hover:text-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nested children */}
        {isExpanded && children.length > 0 && <div className="ml-3 sm:ml-8 pl-4 sm:pl-6 border-l-2 border-slate-600/30 flex flex-col gap-1 mt-2 mb-4">{children.map((child, idx) => renderPegawaiItem(child, depth + 1, idx))}</div>}
      </div>
    );
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
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/30">
                      <GitGraph size={24} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">Struktur Tim</h1>
                  </div>
                  <p className="text-slate-400 pl-1 text-sm">Kelola hierarki organisasi dan data pegawai dengan mudah</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(-1)} className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-medium text-sm transition-all duration-200 flex items-center gap-2">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Kembali</span>
                  </button>
                  <button
                    onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Pegawai Baru</span>
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP, atau jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Warning Box - Pegawai tanpa atasan */}
        {!isLoading && pegawaiTanpaAtasan.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-amber-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-amber-500/20">
                  <AlertCircle size={20} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-amber-100 mb-3">⚠️ Pegawai Belum Memiliki Atasan</h3>
                  <ul className="space-y-2">
                    {pegawaiTanpaAtasan.map((p) => (
                      <li key={p.id_pegawai} className="text-sm text-amber-100 flex items-center justify-between gap-4">
                        <span>
                          <span className="font-semibold">{p.nama_lengkap}</span>
                          <span className="text-amber-300"> ({p.nama_jabatan || "Tanpa Jabatan"})</span>
                        </span>
                        <button
                          onClick={() => navigate(`/dokumen/pegawai/edit/${p.id_pegawai}`)}
                          className="flex-shrink-0 px-3 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 font-medium text-xs transition-all duration-200"
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
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/20">
                  <AlertCircle size={20} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-100">{error}</p>
                </div>
                <button onClick={() => fetchPegawai()} className="flex-shrink-0 px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-100 font-medium text-xs transition-all duration-200">
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
              <p className="text-slate-300 font-medium">Mengolah data hierarki...</p>
            </div>
          ) : filteredPegawai.length === 0 && searchQuery ? (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
                <Search size={48} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">Tidak ada hasil</p>
              <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">Coba ubah pencarian atau tambahkan pegawai baru</p>
              <button
                onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30"
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
                    <div key={idx} className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm hover:border-white/20 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-cyan-300" />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Organization tree */}
              {!childrenMap["root"] ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-gradient-to-br from-slate-800/20 to-slate-700/10">
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
                    <Search size={48} className="text-slate-500" />
                  </div>
                  <p className="text-xl font-bold text-white mb-2">Data Pegawai Kosong</p>
                  <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">Silahkan tambahkan pegawai dengan level tertinggi (tanpa atasan) terlebih dahulu.</p>
                  <button
                    onClick={() => navigate("/dokumen/pegawai/tambah-pegawai")}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30"
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
        <footer className="backdrop-blur-xl bg-slate-900/40 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
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
