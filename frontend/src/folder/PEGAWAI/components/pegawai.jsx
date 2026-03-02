import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardBody, Button, Chip, Spinner, Tooltip, Avatar, Divider } from "@heroui/react";
import { ArrowLeft, UserPlus, PencilLine, Trash2, GitGraph, ChevronRight, ChevronDown, ShieldCheck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deletePegawai, getPegawai } from "../../../services/pegawaiService";

export default function DaftarPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set()); // Use Set for O(1) lookup
  const navigate = useNavigate();

  const fetchPegawai = async () => {
    try {
      setIsLoading(true);
      const response = await getPegawai();
      setPegawai(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // OPTIMIZATION: Map children by parent ID once to avoid O(n^2) filtering in render
  // Ganti useMemo childrenMap Anda dengan ini
  const childrenMap = useMemo(() => {
    const map = {};
    pegawai.forEach((p) => {
      // SYARAT ROOT: Tidak punya atasan DAN harus Level 1
      const isActuallyRoot = (!p.id_atasan || p.id_atasan === "0") && parseInt(p.level) === 1;

      const parentId = isActuallyRoot ? "root" : p.id_atasan || "orphan";

      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(p);
    });
    return map;
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

  const pegawaiTanpaAtasan = useMemo(() => {
    return pegawai.filter((p) => (!p.id_atasan || p.id_atasan === "0") && parseInt(p.level) > 1);
  }, [pegawai]);

  const renderPegawaiItem = (item, depth = 0) => {
    const children = childrenMap[item.id_pegawai] || [];
    const isExpanded = expandedIds.has(item.id_pegawai);

    return (
      <div key={item.id_pegawai} className="w-full">
        <Card isHoverable className={`mb-3 border-l-4 transition-all ${depth === 0 ? "border-l-blue-600 shadow-md" : "border-l-slate-300 shadow-sm"}`}>
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Expansion Trigger */}
                {children.length > 0 ? (
                  <Button isIconOnly size="sm" variant="light" onPress={() => toggleExpand(item.id_pegawai)} className="min-w-8">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </Button>
                ) : (
                  <div className="w-8" />
                )}

                <Avatar name={item.nama_lengkap} size="md" getInitials={(name) => name.charAt(0)} className="bg-linear-to-tr from-slate-200 to-slate-100 text-slate-600 hidden xs:flex" />

                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate uppercase tracking-tight">{item.nama_lengkap}</span>
                    <Chip size="sm" variant="dot" color={depth === 0 ? "primary" : "default"} className="border-none h-6">
                      LV {item.level}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs mt-0.5">
                    <span className="flex items-center gap-1 font-mono">{item.nip || "N/A"}</span>
                    <span className="hidden sm:flex items-center gap-1">
                      <ShieldCheck size={12} /> {item.nama_jabatan || "Staff"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <Tooltip content="Edit">
                  <Button isIconOnly size="sm" variant="flat" onPress={() => navigate(`/dokumen/pegawai/edit/${item.id_pegawai}`)}>
                    <PencilLine size={16} />
                  </Button>
                </Tooltip>
                <Tooltip content="Hapus" color="danger">
                  <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => handleDelete(item.id_pegawai)}>
                    <Trash2 size={16} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Nested Children with visual guide lines */}
        {isExpanded && children.length > 0 && <div className="ml-5 sm:ml-12 pl-4 border-l-2 border-slate-200/60 flex flex-col gap-1 mt-1 mb-4">{children.map((child) => renderPegawaiItem(child, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 min-h-screen bg-[#fcfcfc]">
      {/* Top Navigation / Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <GitGraph size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Struktur Tim</h1>
          </div>
          <p className="text-slate-500 pl-1">Visualisasi hierarki komando dan manajemen data pegawai.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="bordered" className="bg-white border-slate-200 font-semibold" startContent={<ArrowLeft size={18} />} onPress={() => navigate(-1)}>
            Kembali
          </Button>
          <Button color="primary" className="font-bold px-6 shadow-xl shadow-blue-500/20" startContent={<UserPlus size={18} />} onPress={() => navigate("/dokumen/pegawai/tambah-pegawai")}>
            Pegawai Baru
          </Button>
        </div>
      </header>
      {/* --- BOX PERINGATAN (Sesuai Gambar Kamu) --- */}
      {!isLoading && pegawaiTanpaAtasan.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
            <span className="text-lg">⚠️</span>
            <h3>Pegawai Belum Memiliki Atasan:</h3>
          </div>
          <ul className="space-y-1 ml-7">
            {pegawaiTanpaAtasan.map((p) => (
              <li key={p.id_pegawai} className="text-sm text-amber-800 list-disc">
                <span className="font-semibold">{p.nama_lengkap}</span>
                <span className="text-amber-600"> ({p.nama_jabatan || "Tanpa Jabatan"}) — </span>
                <button onClick={() => navigate(`/dokumen/pegawai/edit/${p.id_pegawai}`)} className="text-blue-600 hover:underline font-medium">
                  set atasan
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-slate-400 font-medium text-sm">Mengolah data hierarki...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!childrenMap["root"] ? (
            <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <Search className="text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-semibold text-lg">Data Pegawai Kosong</p>
              <p className="text-slate-400 text-sm mb-6 text-center max-w-xs">Silahkan tambahkan pegawai dengan level tertinggi (tanpa atasan) terlebih dahulu.</p>
              <Button color="primary" variant="flat" onPress={() => navigate("/dokumen/pegawai/tambah-pegawai")}>
                Tambah Sekarang
              </Button>
            </div>
          ) : (
            childrenMap["root"].map((rootPegawai) => renderPegawaiItem(rootPegawai))
          )}
        </div>
      )}

      <footer className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs">
        <p>© 2026 Management System v2.0</p>
        <div className="flex gap-4">
          <span>Total Pegawai: {pegawai.length}</span>
        </div>
      </footer>
    </div>
  );
}
