import React from "react";
import { Printer } from "lucide-react";

export default function PerjanjianKinerjaFullPage() {
  const handlePrint = () => window.print();

  const formatNumber = (num) =>
    new Intl.NumberFormat("id-ID").format(num);

  const data = {
    tahun: 2026,
    perangkat:
      "DINAS KOPERASI DAN USAHA KECIL MENENGAH KABUPATEN KARAWANG",
    kepala: "KADIN KOPERASI DAN UMKM",
    bupati: "H. AEP SYAEPULOH, SE",
    tanggal: "Karawang, 28 Februari 2026",
    sasaran: [
      {
        sasaran:
          "Meningkatnya umkm yang naik kelas menjadi industri",
        indikator:
          "Indeks Kinerja Utama Pemberdayaan Dan Pengawasan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        target: 80,
      },
    ],
    program: [
      {
        nama: "Program Pemberdayaan dan Pengawasan usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
        indikator:
          "Persentase Pemberdayaan Dan Pengawasan usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
        anggaran: 120699000,
      },
      {
        nama:
          "Program Pembinaan Dan Pengembangan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        indikator:
          "Persentase Pembinaan Dan Pengembangan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        anggaran: 936374300,
      },
      {
        nama:
          "Program Penguatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Permodalan Dan Peningkatan Kap",
        indikator:
          "Persentase Penguatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Permodalan Dan Peningkatan Kap",
        anggaran: 923097100,
      },
      {
        nama:
          "Program Peningkatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Pasar Dan Peningkatan Kap",
        indikator:
          "Persentase Peningkatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Pasar Dan Peningkatan Kap",
        anggaran: 354565000,
      },
      {
        nama:
          "Program Peningkatan Pelaku usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Kapasitas Sumber Daya Manusia",
        indikator:
          "Persentase Peningkatan Pelaku usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Kapasitas Sumber Daya Manusia",
        anggaran: 6502165284,
      },
      {
        nama:
          "Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota",
        indikator: "Nilai RB General Perangkat Daerah",
        anggaran: 6425174100,
      },
    ],
  };

  const total = data.program.reduce(
    (a, b) => a + b.anggaran,
    0
  );

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-10 print:py-0">

      {/* FLOATING PRINT BUTTON */}
<button
  onClick={handlePrint}
  className="fixed bottom-8 right-8 z-[9999] print:hidden 
             bg-emerald-600 text-white p-4 rounded-full 
             shadow-2xl hover:bg-emerald-700 transition-all"
>
  <Printer size={22} />
</button>
      {/* ================= HALAMAN 1 ================= */}
      <div
        className="bg-white shadow-2xl print:shadow-none mb-10"
        style={{ width: "794px", height: "1123px" }}
      >
        <div className="px-20 py-24 text-[14px] leading-relaxed">

          <div className="flex justify-center mb-6">
            <img src="/icon_krw.png" className="h-24" />
          </div>

          <div className="text-center font-bold mb-6">
            <p>PERJANJIAN KINERJA (PAGU AKTIF)</p>
            <p>{data.perangkat}</p>
            <p>TAHUN {data.tahun}</p>
          </div>

          <p className="text-justify mb-6">
            Dalam rangka mewujudkan manajemen pemerintahan yang efektif,
            transparan dan akuntabel serta berorientasi pada hasil,
            kami yang bertanda tangan di bawah ini:
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex">
              <div className="w-28">Nama</div>
              <div>: {data.kepala}</div>
            </div>
            <div className="flex">
              <div className="w-28">Jabatan</div>
              <div>: Kepala Badan</div>
            </div>
          </div>

          <p className="mb-4">Selanjutnya disebut PIHAK KESATU.</p>

          <div className="space-y-2 mb-4">
            <div className="flex">
              <div className="w-28">Nama</div>
              <div>: {data.bupati}</div>
            </div>
            <div className="flex">
              <div className="w-28">Jabatan</div>
              <div>: Bupati Karawang</div>
            </div>
          </div>

          <p className="mb-6">
            Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.
          </p>

          <p className="text-justify mb-10">
            PIHAK KESATU berjanji akan mewujudkan target kinerja yang
            seharusnya sesuai perjanjian ini...
          </p>

          <div className="flex justify-between mt-24">
            <div className="text-center">
              <p>PIHAK KEDUA,</p>
              <div className="h-24"></div>
              <p className="font-bold">{data.bupati}</p>
            </div>

            <div className="text-center">
              <p>{data.tanggal}</p>
              <p>PIHAK KESATU,</p>
              <div className="h-24"></div>
              <p className="font-bold">{data.kepala}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= HALAMAN 2 ================= */}
      <div
        className="bg-white shadow-2xl print:shadow-none"
        style={{ width: "794px", height: "1123px" }}
      >
        <div className="px-16 py-20 text-[13px]">

          <div className="text-center font-bold mb-4">
            PERJANJIAN KINERJA TAHUN {data.tahun} (PAGU AKTIF)
            <br />
            KEPALA {data.perangkat}
          </div>

          {/* TABEL SASARAN */}
          <table className="w-full border border-black text-sm mb-6">
            <thead>
              <tr>
                <th className="border border-black p-2 w-10">No</th>
                <th className="border border-black p-2">
                  Sasaran Strategis
                </th>
                <th className="border border-black p-2">
                  Indikator
                </th>
                <th className="border border-black p-2 w-20">
                  Target
                </th>
              </tr>
            </thead>
            <tbody>
              {data.sasaran.map((item, i) => (
                <tr key={i}>
                  <td className="border border-black p-2 text-center">
                    {i + 1}
                  </td>
                  <td className="border border-black p-2">
                    {item.sasaran}
                  </td>
                  <td className="border border-black p-2">
                    {item.indikator}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TABEL PROGRAM */}
          <table className="w-full border border-black text-sm">
            <thead>
              <tr>
                <th className="border border-black p-2 w-10">No</th>
                <th className="border border-black p-2">Program</th>
                <th className="border border-black p-2">
                  Indikator Program
                </th>
                <th className="border border-black p-2 w-28">
                  Anggaran
                </th>
              </tr>
            </thead>
            <tbody>
              {data.program.map((item, i) => (
                <tr key={i}>
                  <td className="border border-black p-2 text-center">
                    {i + 1}
                  </td>
                  <td className="border border-black p-2">
                    {item.nama}
                  </td>
                  <td className="border border-black p-2">
                    {item.indikator}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {formatNumber(item.anggaran)}
                  </td>
                </tr>
              ))}

              <tr className="font-bold">
                <td colSpan={3} className="border border-black p-2 text-center">
                  TOTAL ANGGARAN
                </td>
                <td className="border border-black p-2 text-right">
                  {formatNumber(total)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-16">
            <div className="text-center">
              <p>PEJABAT PENILAI,</p>
              <div className="h-20"></div>
              <p className="font-bold">{data.bupati}</p>
            </div>

            <div className="text-center">
              <p>KEPALA BADAN</p>
              <div className="h-20"></div>
              <p className="font-bold">{data.kepala}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}