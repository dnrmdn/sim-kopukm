import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Chip, Spinner, Tooltip } from "@heroui/react";
import { ArrowLeft, UserPlus, PencilLine, Trash2, GitGraph, ChevronUp, ChevronDown, CreditCard, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPegawai } from "../../../services/pegawaiService";

export default function DaftarPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const navigate = useNavigate();

  const fetchPegawai = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPegawai();
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

  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /**
   * Recursive Render berdasarkan id_atasan
   */
  const renderPegawaiItem = (item) => {
    const children = pegawai.filter((p) => p.id_atasan === item.id_pegawai);

    return (
      <div key={item.id_pegawai}>
        <Card className="border border-gray-100 shadow-sm overflow-visible">
          <CardBody className="flex flex-row justify-between items-start p-5 relative">
            <div className="flex gap-4">
              {children.length > 0 && (
                <Button isIconOnly size="sm" variant="light" className="mt-1 bg-gray-100" onPress={() => toggleExpand(item.id_pegawai)}>
                  {expandedIds.includes(item.id_pegawai) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </Button>
              )}

              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-800 text-lg uppercase">{item.nama_lengkap}</h3>

                <Chip size="sm" radius="sm" className="bg-sky-100 text-sky-700 font-bold px-2">
                  {item.nama_jabatan || "Belum Ditentukan"}
                </Chip>

                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <CreditCard size={14} />
                    <span>NIP: {item.nip || "Tidak Ada"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Briefcase size={14} />
                    <span>Atasan ID: {item.nama_jabatan || "Level Tertinggi"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <Tooltip content="Edit">
                <Button isIconOnly size="sm" variant="bordered" className="border-amber-400 text-amber-500 bg-white">
                  <PencilLine size={16} />
                </Button>
              </Tooltip>

              <Tooltip content="Hapus" color="danger">
                <Button isIconOnly size="sm" variant="flat" color="danger" className="bg-red-50">
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>

        {/* Render Children Recursive */}
        {expandedIds.includes(item.id_pegawai) && children.length > 0 && <div className="pl-6 border-l-2 border-pink-200 flex flex-col gap-4">{children.map((child) => renderPegawaiItem(child))}</div>}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      {/* Header */}
      <Card className="bg-[#f0f9ff] border-none shadow-sm">
        <CardBody className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-2 text-[#0369a1]">
            <GitGraph size={22} />
            <h1 className="text-xl font-bold">Hirarki Komando Pegawai</h1>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="flat" color="danger" className="bg-red-100 text-red-600" startContent={<ArrowLeft size={16} />} onPress={() => navigate(-1)}>
              Kembali
            </Button>

            <Button size="sm" variant="flat" color="primary" className="bg-blue-100 text-blue-700" startContent={<UserPlus size={16} />} onPress={() => navigate("/dokumen/pegawai/tambah")}>
              Pegawai Baru
            </Button>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Spinner label="Memuat Pegawai..." />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* ROOT = Pegawai tanpa atasan */}
          {pegawai.filter((p) => !p.id_atasan).map((item) => renderPegawaiItem(item))}
        </div>
      )}
    </div>
  );
}
