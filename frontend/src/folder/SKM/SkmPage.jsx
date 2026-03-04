import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import SkmCard from "./SkmCard";
import SkmStatistik from "./SkmStatistik";

export default function SkmPage() {
  const [tahun, setTahun] = useState(2026);
  const [data, setData] = useState([]);
  const [statistik, setStatistik] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nama_layanan: "",
    nilai: "",
    tahun: 2026,
  });

  useEffect(() => {
    fetchSkm();
  }, [tahun]);

  async function fetchSkm() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/skm/dashboard", {
        params: { tahun },
      });
      setData(res.data?.layanan || []);
      setStatistik(res.data?.statistik || null);
    } catch (err) {
      console.error("Gagal mengambil data SKM:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axiosInstance.post("/skm", form);
      setShowModal(false);
      setForm({ nama_layanan: "", nilai: "", tahun });
      fetchSkm();
    } catch (err) {
      alert("Gagal menyimpan survey");
      console.error(err);
    }
  }

  if (loading)
    return (
      <div className="p-10 text-sm text-slate-500 animate-pulse">
        Memuat data SKM...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              Survey Kepuasan Masyarakat
            </h1>
            <p className="text-sm text-slate-500">
              Dinas Koperasi & UKM
            </p>
          </div>

          <div className="flex gap-2">
            <select
              className="rounded-md border px-3 py-2 text-sm bg-white"
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
            >
              <option value={2026}>Tahun 2026</option>
              <option value={2025}>Tahun 2025</option>
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Tambah Survey
            </button>
          </div>
        </div>

        {/* CARD LIST */}
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((item, i) => (
            <SkmCard key={i} data={item} />
          ))}
        </div>

        {/* STATISTIK */}
        {statistik && (
          <div className="mt-6">
            <SkmStatistik data={statistik} />
          </div>
        )}
      </div>

      {/* MODAL TAMBAH SURVEY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-base font-semibold">
                Tambah Survey SKM
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pelayanan UMKM"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={form.nama_layanan}
                  onChange={(e) =>
                    setForm({ ...form, nama_layanan: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nilai Kepuasan (1–100)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Masukkan nilai"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={form.nilai}
                  onChange={(e) =>
                    setForm({ ...form, nilai: e.target.value })
                  }
                  required
                />
                <p className="mt-1 text-xs text-slate-400">
                  Semakin tinggi nilai, semakin baik tingkat kepuasan
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 border-t bg-slate-50 px-6 py-4 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}