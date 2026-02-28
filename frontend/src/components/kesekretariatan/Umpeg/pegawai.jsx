import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Chip, Spinner, Tooltip } from "@heroui/react";
import { 
  ArrowLeft, UserPlus, PencilLine, Trash2, GitGraph, 
  ChevronUp, ChevronDown, User, CreditCard, Briefcase 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPegawai } from "../../../services/pegawaiService";

export default function DaftarPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPegawai = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPegawai();
      // Mengambil data dari response.data.data
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      {/* 1. Header Card */}
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
            <Button size="sm" variant="bordered" className="bg-white border-gray-300" startContent={<ChevronUp size={16} />}>Expand</Button>
            <Button size="sm" variant="bordered" className="bg-white border-gray-300" startContent={<ChevronDown size={16} />}>Collapse</Button>
          </div>
        </CardBody>
      </Card>

      {/* 2. Warning Alert - Filter pegawai yang level-nya 0 (Belum ada atasan) */}
      {pegawai.some(p => p.level === 0) && (
        <Card className="bg-[#fffbeb] border-none shadow-none border-l-4 border-amber-400">
          <CardBody className="p-3 text-[#b45309] text-sm flex flex-row items-center gap-2">
            <span className="font-bold">⚠️ Ada Pegawai Belum Memiliki Atasan (Level 0)</span>
          </CardBody>
        </Card>
      )}

      {/* 3. Hirarki List */}
      {isLoading ? (
        <div className="flex justify-center p-10"><Spinner label="Memuat Pegawai..." /></div>
      ) : (
        <div className="pl-6 border-l-2 border-pink-200 flex flex-col gap-4">
          {pegawai.map((item) => (
            <Card key={item.id} className="border-1 border-gray-100 shadow-sm overflow-visible">
              <CardBody className="flex flex-row justify-between items-start p-5 relative">
                <div className="flex gap-4">
                  <Button isIconOnly size="sm" variant="light" className="mt-1 bg-gray-100">
                    <ChevronDown size={14} className="text-gray-500" />
                  </Button>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-800 text-lg uppercase">{item.nama}</h3>
                    <Chip size="sm" radius="sm" className="bg-sky-100 text-sky-700 font-bold px-2">
                      Lvl {item.level}
                    </Chip>

                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <CreditCard size={14} /> <span>NIP: {item.nip || "Tidak Ada"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Briefcase size={14} /> <span>Jabatan: {item.jabatan || "Belum Ditentukan"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Tooltip content="Edit"><Button isIconOnly size="sm" variant="bordered" className="border-amber-400 text-amber-500 bg-white"><PencilLine size={16} /></Button></Tooltip>
                  <Tooltip content="Hapus" color="danger"><Button isIconOnly size="sm" variant="flat" color="danger" className="bg-red-50"><Trash2 size={16} /></Button></Tooltip>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}