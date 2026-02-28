import React, { useState } from "react";
import { Printer } from "lucide-react";

export default function CoverPerjanjianKinerjaPage() {
  const [jenis, setJenis] = useState("PERGESERAN I");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center py-10 print:py-0">

      <div className="fixed top-24 left-6 z-40 print:hidden">
  <div className="backdrop-blur bg-white/80 shadow-md rounded-2xl border border-slate-200 px-4 py-3">
    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
      Pilih Jenis
    </label>
    <select
      value={jenis}
      onChange={(e) => setJenis(e.target.value)}
      className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
    >
      <option>AKTIF</option>
      <option>MURNI</option>
      <option>PERGESERAN I</option>
      <option>PERGESERAN II</option>
      <option>EFISIENSI</option>
      <option>PERUBAHAN</option>
    </select>
  </div>
</div>

      {/* 🔹 FLOATING PRINT BUTTON (RIGHT BOTTOM) */}
      <button
        onClick={handlePrint}
        className="fixed bottom-8 right-8 z-50 print:hidden bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-700 transition"
      >
        <Printer size={22} />
      </button>

      {/* 🔹 A4 COVER */}
      <div
        className="relative bg-white shadow-2xl print:shadow-none"
        style={{
          width: "794px",
          height: "1123px",
        }}
      >
        {/* Motif Background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(#1e3a8a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-16 py-20">

          {/* HEADER */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-widest text-slate-700">
              PERJANJIAN KINERJA
            </h1>

            <div className="flex justify-center items-center gap-4 text-lg font-bold">
              <span className="text-orange-600 border-b-2 border-orange-600 px-2">
                {jenis}
              </span>
              <span className="text-slate-600 border-b-2 border-slate-600 px-2">
                TAHUN 2026
              </span>
            </div>
          </div>

          {/* LOGO */}
          <div className="flex justify-center">
            <img
              src="/icon_krw.png"
              alt="Logo Kabupaten"
              className="w-65"
            />
          </div>

          {/* FOOTER */}
          <div className="text-center space-y-4">
            <h2 className="text-lg font-bold tracking-widest text-slate-700">
              DINAS KOPERASI DAN USAHA KECIL MENENGAH
            </h2>
            <p className="text-slate-600 font-semibold">
              KABUPATEN KARAWANG
            </p>
            <p className="text-slate-500">2026</p>

            <div className="pt-6 text-xs text-slate-400 border-t border-slate-200">
              Jl. A. Yani No. 7000, Karawang Barat • (0267) 123456 •
              dinkopukm@karawang.go.id
            </div>
          </div>
        </div>

        {/* FRAME */}
        <div className="absolute inset-6 border-2 border-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}