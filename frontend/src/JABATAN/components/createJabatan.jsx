import React, { useState } from "react";
import { Card, CardBody, Input, Button } from "@heroui/react";
import { PlusCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Ensure this path matches your folder structure correctly
import { createJabatan } from "@/services/jabatanService";

export default function TambahJabatan() {
  const [namaJabatan, setNamaJabatan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSimpan = async () => {
    if (!namaJabatan.trim()) {
      alert("Nama jabatan harus diisi");
      return;
    }

    try {
      setIsLoading(true);

      // Calling your service function
      const response = await createJabatan(namaJabatan);

      if (response.data.success) {
        alert("Data berhasil disimpan!");
        navigate(-1); // Go back to the list page
      }
    } catch (error) {
      console.error("Error saving jabatan:", error);
      alert(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="border-none shadow-sm overflow-hidden">
        {/* Header matching your reference image */}
        <div className="bg-[#006fee] p-3 flex items-center gap-2 text-white">
          <PlusCircle size={20} />
          <h2 className="text-md font-semibold">Tambah Jabatan</h2>
        </div>

        <CardBody className="p-6 border border-gray-200 rounded-b-xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-normal text-gray-900">Nama Jabatan</label>
              <Input
                placeholder="Masukkan nama jabatan..." // Add a placeholder to test visibility
                variant="bordered"
                radius="sm"
                size="md"
                className="w-full text-black" // Ensure text is visible
                value={namaJabatan}
                onValueChange={setNamaJabatan}
                classNames={{
                  // Added 'border' and 'opacity-100' to ensure it's not hidden
                  inputWrapper: "border-1 border-gray-400 shadow-none h-10 bg-white opacity-100",
                  input: "text-black placeholder:text-gray-400",
                }}
              />
              
            </div>

            <div className="flex gap-2">
              {/* Green Simpan Button */}
              <Button color="success" radius="sm" className="text-white bg-[#198754] px-4 font-medium" startContent={<CheckCircle size={16} />} onPress={handleSimpan} isLoading={isLoading}>
                Simpan
              </Button>

              {/* Gray Kembali Button */}
              <Button radius="sm" className="bg-[#6c757d] text-white px-4 font-medium" startContent={<ArrowLeft size={16} />} onPress={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
