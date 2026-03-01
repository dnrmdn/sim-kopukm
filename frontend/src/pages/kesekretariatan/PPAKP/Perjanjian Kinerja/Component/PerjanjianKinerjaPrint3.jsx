import React from "react";
import { Printer } from "lucide-react";

export default function PerjanjianKinerjaEselon4Perfect() {
  const handlePrint = () => window.print();

  const formatNumber = (num) =>
    new Intl.NumberFormat("id-ID").format(num);

  const pejabatList = [
    {
      nama: "ABDURROHMAN, SH",
      nip: "197309012010011005",
      jabatan:
        "KETUA KERJA KELOMPOK SUB-SUBSTANSI KETAHANAN SOSIAL, EKONOMI, BUDAYA DAN AGAMA",
      atasan: "SYARIFAH LENNY M, AKS",
      atasanNip: "197302031999032004",
      kegiatan: [
        {
          nama:
            "Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan Bidang Ketahanan Ekonomi, Sosial dan Budaya",
          indikator:
            "Persentase Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan",
          target: "60 Orang",
        },
      ],
      sub: [
        {
          nama: "Pelaksanaan Kebijakan",
          indikator: "Jumlah Laporan Monitoring",
          target: "60 Orang",
          anggaran: 70404700,
        },
        {
          nama: "Pelaksanaan Koordinasi",
          indikator: "Jumlah Peserta Koordinasi",
          target: "4 Orang",
          anggaran: 800000000,
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-200 flex flex-col items-center py-10 print:py-0">

      {/* PRINT BUTTON */}
      <button
        onClick={handlePrint}
        className="fixed bottom-8 right-8 z-[9999] print:hidden 
                   bg-emerald-600 text-white p-4 rounded-full shadow-xl"
      >
        <Printer size={22} />
      </button>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2.5cm;
          }
          body {
            margin: 0;
          }
        }
      `}</style>

      {pejabatList.map((p, idx) => {
        const total = p.sub.reduce((a, b) => a + b.anggaran, 0);

        return (
          <React.Fragment key={idx}>

            {/* ================= HALAMAN 1 ================= */}
            <div
              className="bg-white shadow-2xl print:shadow-none mb-10"
              style={{
                width: "794px",
                height: "1123px",
                fontFamily: "Times New Roman",
                fontSize: "12pt",
              }}
            >
              <div className="px-16 py-20 leading-relaxed">

                <div className="flex justify-center mb-4">
                  <img src="/icon_krw.png" className="h-20" />
                </div>

                <div className="text-center font-bold mb-6">
                  <p>PERJANJIAN KINERJA (PAGU AKTIF TERAKHIR)</p>
                  <p>BADAN KESATUAN BANGSA DAN POLITIK KABUPATEN KARAWANG</p>
                  <p>TAHUN 2026</p>
                </div>

                <p className="text-justify mb-6">
                  Dalam rangka mewujudkan manajemen pemerintahan yang efektif,
                  transparan dan akuntabel serta berorientasi pada hasil,
                  kami yang bertanda tangan di bawah ini:
                </p>

                <div className="space-y-1 mb-4">
                  <div>Nama : {p.nama}</div>
                  <div>Jabatan : {p.jabatan}</div>
                </div>

                <p className="mb-4">Selanjutnya disebut PIHAK KESATU.</p>

                <div className="space-y-1 mb-4">
                  <div>Nama : {p.atasan}</div>
                  <div>Jabatan : Kepala Bidang</div>
                </div>

                <p className="mb-6">
                  Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.
                </p>

                <div className="flex justify-between mt-24">
                  <div className="text-center">
                    <p>PIHAK KEDUA,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{p.atasan}</p>
                    <p>NIP. {p.atasanNip}</p>
                  </div>

                  <div className="text-center">
                    <p>PIHAK KESATU,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{p.nama}</p>
                    <p>NIP. {p.nip}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= HALAMAN 2 ================= */}
            <div
              className="bg-white shadow-2xl print:shadow-none mb-10"
              style={{
                width: "794px",
                height: "1123px",
                fontFamily: "Times New Roman",
                fontSize: "11pt",
              }}
            >
              <div className="px-16 py-16">

                <div className="text-center font-bold mb-4">
                  {p.jabatan}
                  <br />
                  TAHUN 2026
                </div>

                {/* TABEL KEGIATAN */}
                <table className="w-full border border-black mb-6">
                  <thead>
                    <tr>
                      <th className="border p-2 w-8">No</th>
                      <th className="border p-2">Kegiatan</th>
                      <th className="border p-2">Indikator</th>
                      <th className="border p-2 w-20">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.kegiatan.map((k, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2">{k.nama}</td>
                        <td className="border p-2">{k.indikator}</td>
                        <td className="border p-2 text-center">{k.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TABEL SUB KEGIATAN */}
                <table className="w-full border border-black">
                  <thead>
                    <tr>
                      <th className="border p-2 w-8">No</th>
                      <th className="border p-2">Sub Kegiatan</th>
                      <th className="border p-2">Indikator</th>
                      <th className="border p-2 w-20">Target</th>
                      <th className="border p-2 w-28">Anggaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.sub.map((s, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2">{s.nama}</td>
                        <td className="border p-2">{s.indikator}</td>
                        <td className="border p-2 text-center">{s.target}</td>
                        <td className="border p-2 text-right">
                          {formatNumber(s.anggaran)}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={4} className="border p-2 text-center font-bold">
                        TOTAL ANGGARAN
                      </td>
                      <td className="border p-2 text-right font-bold">
                        {formatNumber(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between mt-20">
                  <div className="text-center">
                    <p>PEJABAT PENILAI,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{p.atasan}</p>
                    <p>NIP. {p.atasanNip}</p>
                  </div>

                  <div className="text-center">
                    <p>{p.jabatan}</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{p.nama}</p>
                    <p>NIP. {p.nip}</p>
                  </div>
                </div>

              </div>
            </div>

          </React.Fragment>
        );
      })}
    </div>
  );
}