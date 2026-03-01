import React from "react";
import { Printer } from "lucide-react";

export default function PerjanjianKinerjaEselon3Page() {
  const handlePrint = () => window.print();

  const formatNumber = (num) =>
    new Intl.NumberFormat("id-ID").format(num);

  // ================= DUMMY DATA =================
  const pejabatList = [
    {
      jabatan:
        "SEKRETARIS Dinas Koperasi dan Usaha Kecil Menengah Kabupaten Karawang",
      nama: "Nama Pejabat Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [
        {
          program:
            "Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota",
          indikator: "Nilai RB General Perangkat Daerah",
          target: "100%",
        },
      ],
      kegiatan: [
        {
          nama: "Administrasi Keuangan Perangkat Daerah",
          indikator: "Persentase Realisasi APBD Perangkat Daerah",
          anggaran: 4956606800,
        },
        {
          nama: "Administrasi Umum Perangkat Daerah",
          indikator: "Nilai SKM Perangkat Daerah",
          anggaran: 489582500,
        },
      ],
    },
    {
      jabatan:
        "KEPALA BIDANG Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
      nama: "Nama Jabatan Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [
        {
          program:
            "Program Pembinaan dan Pengembangan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
          indikator:
            "Persentase Pembinaan Dan Pengembangan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
          target: "100%",
        },
      ],
      kegiatan: [
        {
          nama:
            "Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan Bidang Pembinaan dan Pengembangan Usaha Koperasi dan Usaha",
          indikator: "Persentase Perumusan Kebijakan",
          anggaran: 936374300,
        },
      ],
    },
    {
      jabatan:
        "KEPALA BIDANG KOPERASI DAN USAHA KECIL MENENGAH",
      nama: "nama Pejabat Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [
        {
          program:
            "Program Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
          indikator:
            "Persentase Pemberdayaan Dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
          target: "100%",
        },
      ],
      kegiatan: [
        {
          nama:
            "Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan Bidang Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
          indikator: "Persentase Kebijakan Teknis",
          anggaran: 120699000,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-10 print:py-0">

      {/* PRINT BUTTON */}
      <button
        onClick={handlePrint}
        className="fixed bottom-8 right-8 z-[9999] print:hidden 
                   bg-emerald-600 text-white p-4 rounded-full shadow-xl"
      >
        <Printer size={22} />
      </button>

      {pejabatList.map((pejabat, index) => {
        const total = pejabat.kegiatan.reduce(
          (a, b) => a + b.anggaran,
          0
        );

        return (
          <React.Fragment key={index}>

            {/* ================= HALAMAN NARASI ================= */}
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
                  <p>Dinas Koperasi dan Usaha Kecil Menengah</p>
                  <p>TAHUN 2026</p>
                </div>

                <p className="mb-6 text-justify">
                  Dalam rangka mewujudkan manajemen pemerintahan yang efektif,
                  transparan dan akuntabel serta berorientasi pada hasil,
                  kami yang bertanda tangan di bawah ini:
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex">
                    <div className="w-28">Nama</div>
                    <div>: {pejabat.nama}</div>
                  </div>
                  <div className="flex">
                    <div className="w-28">Jabatan</div>
                    <div>: {pejabat.jabatan}</div>
                  </div>
                </div>

                <p className="mb-4">Selanjutnya disebut PIHAK KESATU.</p>

                <div className="space-y-2 mb-4">
                  <div className="flex">
                    <div className="w-28">Nama</div>
                    <div>: {pejabat.atasan}</div>
                  </div>
                  <div className="flex">
                    <div className="w-28">Jabatan</div>
                    <div>: Kepala Badan</div>
                  </div>
                </div>

                <p className="mb-6">
                  Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.
                </p>

                <div className="flex justify-between mt-24">
                  <div className="text-center">
                    <p>PIHAK KEDUA</p>
                    <div className="h-20"></div>
                    <p className="font-bold">{pejabat.atasan}</p>
                  </div>

                  <div className="text-center">
                    <p>PIHAK KESATU</p>
                    <div className="h-20"></div>
                    <p className="font-bold">{pejabat.nama}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= HALAMAN TABEL ================= */}
            <div
              className="bg-white shadow-2xl print:shadow-none mb-10"
              style={{ width: "794px", height: "1123px" }}
            >
              <div className="px-16 py-20 text-[13px]">

                <div className="text-center font-bold mb-4">
                  PERJANJIAN KINERJA TAHUN 2026
                  <br />
                  {pejabat.jabatan}
                </div>

                <table className="w-full border border-black text-sm mb-6">
                  <thead>
                    <tr>
                      <th className="border p-2 w-10">No</th>
                      <th className="border p-2">Sasaran Strategis/Program</th>
                      <th className="border p-2">Indikator Program</th>
                      <th className="border p-2 w-20">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pejabat.sasaran.map((s, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2">{s.program}</td>
                        <td className="border p-2">{s.indikator}</td>
                        <td className="border p-2 text-center">{s.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="w-full border border-black text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2 w-10">No</th>
                      <th className="border p-2">Kegiatan</th>
                      <th className="border p-2">Indikator</th>
                      <th className="border p-2 w-28">Anggaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pejabat.kegiatan.map((k, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2">{k.nama}</td>
                        <td className="border p-2">{k.indikator}</td>
                        <td className="border p-2 text-right">
                          {formatNumber(k.anggaran)}
                        </td>
                      </tr>
                    ))}

                    <tr className="font-bold">
                      <td colSpan={3} className="border p-2 text-center">
                        TOTAL ANGGARAN
                      </td>
                      <td className="border p-2 text-right">
                        {formatNumber(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>

          </React.Fragment>
        );
      })}
    </div>
  );
}