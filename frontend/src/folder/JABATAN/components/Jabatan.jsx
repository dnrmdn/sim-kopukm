import React, { useEffect, useState } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Tooltip, Spinner
} from "@heroui/react";
import { PlusCircle, ArrowLeft, PencilLine, Trash2 } from "lucide-react";
import { deleteJabatan, getAllJabatan } from "@/services/jabatanService";
// 1. Correct import for functional navigation
import { useNavigate } from "react-router-dom"; 

export default function DaftarJabatan() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Initialize the navigate function
  const navigate = useNavigate(); 

  const fetchJabatan = async () => {
    try {
      setIsLoading(true);
      const response = await getAllJabatan();
      setData(response.data.data || []); 
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jabatan ini?")) {
      try {
        await deleteJabatan(id);
        fetchJabatan(); 
      } catch (error) {
        const errMsg = error.response?.data?.message || "Gagal menghapus data";
        alert(errMsg);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Daftar Jabatan</h1>
        <div className="flex gap-3">
          <Button 
            variant="flat" 
            color="danger" 
            className="bg-red-100 text-red-600"
            startContent={<ArrowLeft size={18} />}
            // 3. Use the navigate function to go back
            onPress={() => navigate(-1)} 
          >
            Kembali
          </Button>
          
          <Button 
            color="primary" 
            variant="flat"
            className="bg-blue-100 text-blue-700"
            startContent={<PlusCircle size={18} />}
            // 4. Navigate to the ROUTE path (defined in your App.jsx)
            // DO NOT use the .jsx file name here
            onPress={() => navigate("/dokumen/jabatan/create-jabatan-page")} 
          >
            Tambah Jabatan
          </Button>
        </div>
      </div>

      <Table 
        aria-label="Tabel Daftar Jabatan"
        shadow="sm"
        classNames={{
          th: "bg-[#1f1f1f] text-white text-sm",
          td: "py-3 border-b border-divider",
        }}
      >
        <TableHeader>
          <TableColumn width={60}>No</TableColumn>
          <TableColumn>Nama Jabatan</TableColumn>
          <TableColumn align="center" width={120}>Aksi</TableColumn>
        </TableHeader>
        
        <TableBody 
          emptyContent={"Tidak ada data jabatan."}
          isLoading={isLoading}
          loadingContent={<Spinner label="Memuat..." />}
        >
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell> 
              <TableCell>{item.nama_jabatan}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Tooltip content="Edit">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      className="bg-amber-400 text-white min-w-8 h-8"
                      // Example for edit navigation
                      onPress={() => navigate(`/kesekretariatan/umpeg/jabatan/edit/${item.id}`)}
                    >
                      <PencilLine size={16} />
                    </Button>
                  </Tooltip>
                  
                  <Tooltip content="Hapus" color="danger">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      color="danger"
                      className="min-w-8 h-8"
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}