import React, { useEffect, useState } from "react";
import { Card, CardBody, Input, Button, Select, SelectItem, CardHeader, Divider } from "@heroui/react";
import { User, Hash, TrendingUp, Users, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormPegawai({ initialData = {}, onSubmit, isEdit = false, pegawaiList = [] }) {
  const [form, setForm] = useState({
    nama_lengkap: "",
    nip: "",
    level: "",
    id_atasan: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        nama_lengkap: initialData.nama_lengkap || "",
        nip: initialData.nip || "",
        level: initialData.level?.toString() || "",
        id_atasan: initialData.id_atasan?.toString() || "",
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
  console.log("FORM DATA:", form); // ⬅️ debug dulu

  if (!form.nama_lengkap || !form.nip || !form.level) {
    alert("Semua field wajib diisi!");
    return;
  }

  onSubmit(form);
};

  const levels = ["1", "2", "3", "4", "5"];

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-md">
        <CardHeader className="flex flex-col items-start px-8 pt-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{isEdit ? "Perbarui Data Pegawai" : "Registrasi Pegawai Baru"}</h2>
          <p className="text-slate-500 text-sm mt-1">Pastikan data hierarki sesuai dengan struktur organisasi terbaru.</p>
        </CardHeader>

        <Divider className="my-4 mx-8 w-auto bg-slate-100" />

        <CardBody className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {/* NAMA */}
            <div className="md:col-span-2">
              <label id="label-nama" className="block text-slate-700 font-semibold text-sm mb-2">
                Nama Lengkap
              </label>
              <Input
                aria-labelledby="label-nama"
                isRequired
                placeholder="Contoh: Aditiya Wijaya"
                variant="bordered"
                size="lg"
                startContent={<User className="text-slate-400" size={18} />}
                value={form.nama_lengkap}
                onValueChange={(val) => handleChange("nama_lengkap", val)}
              />
            </div>

            {/* NIP */}
            <div>
              <label id="label-nip" className="block text-slate-700 font-semibold text-sm mb-2">
                NIP
              </label>
              <Input
                aria-labelledby="label-nip"
                isRequired
                placeholder="18 digit angka"
                variant="bordered"
                size="lg"
                startContent={<Hash className="text-slate-400" size={18} />}
                value={form.nip}
                onValueChange={(val) => handleChange("nip", val)}
              />
            </div>

            {/* LEVEL */}
            <div>
              <label id="label-level" className="block text-slate-700 font-semibold text-sm mb-2">
                Level
              </label>
              <Select
                aria-labelledby="label-level"
                isRequired
                placeholder="Pilih Level"
                variant="bordered"
                size="lg"
                startContent={<TrendingUp className="text-slate-400" size={18} />}
                selectedKeys={form.level ? [form.level] : []}
                onSelectionChange={(keys) => handleChange("level", Array.from(keys)[0])}
              >
                {levels.map((lvl) => (
                  <SelectItem key={lvl} textValue={`Level ${lvl}`}>
                    Level {lvl}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* ATASAN */}
            <div className="md:col-span-2">
              <label id="label-atasan" className="block text-slate-700 font-semibold text-sm mb-2">
                Atasan
              </label>
              <Select
                aria-labelledby="label-atasan"
                placeholder="Cari nama atasan..."
                variant="bordered"
                size="lg"
                startContent={<Users className="text-slate-400" size={18} />}
                selectedKeys={form.id_atasan ? [form.id_atasan] : []}
                onSelectionChange={(keys) => handleChange("id_atasan", Array.from(keys)[0])}
              >
                <SelectItem key="0" textValue="Level Tertinggi">
                  — Tidak Ada (Level Tertinggi) —
                </SelectItem>

                {pegawaiList
                  .filter((p) => p.id_pegawai.toString() !== initialData.id_pegawai?.toString())
                  .map((p) => (
                    <SelectItem key={p.id_pegawai.toString()} textValue={`${p.nama_lengkap} - Level ${p.level}`}>
                      <div className="flex justify-between items-center w-full">
                        <span>{p.nama_lengkap}</span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">Level {p.level}</span>
                      </div>
                    </SelectItem>
                  ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-16">
            <Button variant="light" className="px-8 font-medium text-slate-600" startContent={<X size={18} />} onPress={() => navigate(-1)}>
              Batal
            </Button>

            <Button color="primary" size="lg" className="px-10 font-bold bg-blue-600 shadow-lg shadow-blue-200" startContent={<Save size={18} />} onPress={handleSubmit}>
              {isEdit ? "Simpan Perubahan" : "Daftarkan Pegawai"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
