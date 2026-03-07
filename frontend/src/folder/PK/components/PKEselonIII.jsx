import React, { useEffect } from "react";
import { Printer, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PerjanjianKinerjaEselon3Page() {
  const navigate = useNavigate();
  const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num);

  const pejabatList = [
    {
      jabatan: "SEKRETARIS Dinas Koperasi dan Usaha Kecil Menengah Kabupaten Karawang",
      nama: "Nama Pejabat Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [{ program: "Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota", indikator: "Nilai RB General Perangkat Daerah", target: "100%" }],
      kegiatan: [
        { nama: "Administrasi Keuangan Perangkat Daerah", indikator: "Persentase Realisasi APBD Perangkat Daerah", anggaran: 4956606800 },
        { nama: "Administrasi Umum Perangkat Daerah", indikator: "Nilai SKM Perangkat Daerah", anggaran: 489582500 },
      ],
    },
    {
      jabatan: "KEPALA BIDANG Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
      nama: "Nama Jabatan Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [{ program: "Program Pembinaan dan Pengembangan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah", indikator: "Persentase Pembinaan Dan Pengembangan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah", target: "100%" }],
      kegiatan: [{ nama: "Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan Bidang Pembinaan dan Pengembangan Usaha Koperasi dan Usaha", indikator: "Persentase Perumusan Kebijakan", anggaran: 936374300 }],
    },
    {
      jabatan: "KEPALA BIDANG KOPERASI DAN USAHA KECIL MENENGAH",
      nama: "nama Pejabat Eselon III",
      atasan: "Nama Pejabat Eselon II",
      sasaran: [{ program: "Program Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah", indikator: "Persentase Pemberdayaan Dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah", target: "100%" }],
      kegiatan: [{ nama: "Perumusan Kebijakan Teknis dan Pemantapan Pelaksanaan Bidang Pemberdayaan dan Pengawasan Usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah", indikator: "Persentase Kebijakan Teknis", anggaran: 120699000 }],
    },
  ];

  // Pindahkan #esl3-pages langsung ke body agar tidak terpengaruh navbar/layout
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "esl3-print-style";
    styleEl.textContent = `
      @media print {
        @page { size: A4 portrait; margin: 0; }
        body > * { display: none !important; }
        body > #esl3-pages { display: block !important; }
        #esl3-pages .pk-page {
          page-break-after: always;
          width: 794px;
          height: 1123px;
          overflow: hidden;
          background: white;
          box-sizing: border-box;
        }
        #esl3-pages .pk-page:last-child { page-break-after: avoid; }
      }
    `;
    document.head.appendChild(styleEl);

    const pagesEl = document.getElementById("esl3-pages");
    if (pagesEl) document.body.appendChild(pagesEl);

    return () => {
      const root = document.getElementById("root");
      if (pagesEl && root) root.appendChild(pagesEl);
      styleEl.remove();
    };
  }, []);

  const tdStyle = { border: "1px solid black", padding: "6px" };
  const thStyle = { border: "1px solid black", padding: "6px", background: "#f1f5f9" };

  return (
    <>
      {/* ── Screen UI ── */}
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
        </div>

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Perjanjian Kinerja Eselon III
                  </h1>
                </div>
                <p className="text-gray-500 text-sm pl-1">
                  Dinas Koperasi dan Usaha Kecil Menengah — {pejabatList.length} Pejabat
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
          <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
            <div className="p-5 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total <span className="font-bold text-gray-800">{pejabatList.length * 2} halaman</span> akan dicetak
              </p>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                <Printer size={16} />
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>

        {/* Screen Preview */}
        <div className="flex flex-col items-center gap-4 px-4 pb-16">
          {pejabatList.map((pejabat, index) => {
            const total = pejabat.kegiatan.reduce((a, b) => a + b.anggaran, 0);
            return (
              <React.Fragment key={index}>
                {/* Label pejabat */}
                <div className="w-[794px] flex items-center gap-3 pt-2">
                  <div className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold">
                    Pejabat {index + 1}
                  </div>
                  <span className="text-xs text-gray-500 truncate">{pejabat.jabatan}</span>
                </div>

                {/* Halaman Narasi */}
                <div className="bg-white shadow-2xl" style={{ width: "794px", height: "1123px" }}>
                  <div style={{ padding: "96px 80px", fontSize: "14px", lineHeight: "1.6" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                      <img src="/icon_krw.png" style={{ height: "96px" }} alt="Logo" />
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "24px" }}>
                      <p>PERJANJIAN KINERJA (PAGU AKTIF)</p>
                      <p>Dinas Koperasi dan Usaha Kecil Menengah</p>
                      <p>TAHUN 2026</p>
                    </div>
                    <p style={{ textAlign: "justify", marginBottom: "24px" }}>
                      Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan dan akuntabel
                      serta berorientasi pada hasil, kami yang bertanda tangan di bawah ini:
                    </p>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {pejabat.nama}</div></div>
                      <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: {pejabat.jabatan}</div></div>
                    </div>
                    <p style={{ marginBottom: "16px" }}>Selanjutnya disebut PIHAK KESATU.</p>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {pejabat.atasan}</div></div>
                      <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Kepala Badan</div></div>
                    </div>
                    <p style={{ marginBottom: "24px" }}>Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "96px" }}>
                      <div style={{ textAlign: "center" }}>
                        <p>PIHAK KEDUA</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{pejabat.atasan}</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p>PIHAK KESATU</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{pejabat.nama}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Halaman Tabel */}
                <div className="bg-white shadow-2xl" style={{ width: "794px", height: "1123px" }}>
                  <div style={{ padding: "80px 64px", fontSize: "13px" }}>
                    <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
                      PERJANJIAN KINERJA TAHUN 2026<br />{pejabat.jabatan}
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
                      <thead>
                        <tr>
                          <th style={{ ...thStyle, width: "32px" }}>No</th>
                          <th style={thStyle}>Sasaran Strategis/Program</th>
                          <th style={thStyle}>Indikator Program</th>
                          <th style={{ ...thStyle, width: "64px" }}>Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pejabat.sasaran.map((s, i) => (
                          <tr key={i}>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                            <td style={tdStyle}>{s.program}</td>
                            <td style={tdStyle}>{s.indikator}</td>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{s.target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr>
                          <th style={{ ...thStyle, width: "32px" }}>No</th>
                          <th style={thStyle}>Kegiatan</th>
                          <th style={thStyle}>Indikator</th>
                          <th style={{ ...thStyle, width: "100px" }}>Anggaran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pejabat.kegiatan.map((k, i) => (
                          <tr key={i}>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                            <td style={tdStyle}>{k.nama}</td>
                            <td style={tdStyle}>{k.indikator}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(k.anggaran)}</td>
                          </tr>
                        ))}
                        <tr style={{ fontWeight: "bold" }}>
                          <td colSpan={3} style={{ ...tdStyle, textAlign: "center" }}>TOTAL ANGGARAN</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Print-only pages — dipindahkan ke body via useEffect ── */}
      <div id="esl3-pages" style={{ display: "none" }}>
        {pejabatList.map((pejabat, index) => {
          const total = pejabat.kegiatan.reduce((a, b) => a + b.anggaran, 0);
          return (
            <React.Fragment key={index}>
              {/* Halaman Narasi */}
              <div className="pk-page" style={{ padding: "96px 80px", fontSize: "14px", lineHeight: "1.6" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                  <img src="/icon_krw.png" style={{ height: "96px" }} alt="Logo" />
                </div>
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "24px" }}>
                  <p>PERJANJIAN KINERJA (PAGU AKTIF)</p>
                  <p>Dinas Koperasi dan Usaha Kecil Menengah</p>
                  <p>TAHUN 2026</p>
                </div>
                <p style={{ textAlign: "justify", marginBottom: "24px" }}>
                  Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan dan akuntabel
                  serta berorientasi pada hasil, kami yang bertanda tangan di bawah ini:
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {pejabat.nama}</div></div>
                  <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: {pejabat.jabatan}</div></div>
                </div>
                <p style={{ marginBottom: "16px" }}>Selanjutnya disebut PIHAK KESATU.</p>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {pejabat.atasan}</div></div>
                  <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Kepala Badan</div></div>
                </div>
                <p style={{ marginBottom: "24px" }}>Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "96px" }}>
                  <div style={{ textAlign: "center" }}>
                    <p>PIHAK KEDUA</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{pejabat.atasan}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p>PIHAK KESATU</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{pejabat.nama}</p>
                  </div>
                </div>
              </div>

              {/* Halaman Tabel */}
              <div className="pk-page" style={{ padding: "80px 64px", fontSize: "13px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
                  PERJANJIAN KINERJA TAHUN 2026<br />{pejabat.jabatan}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: "32px" }}>No</th>
                      <th style={thStyle}>Sasaran Strategis/Program</th>
                      <th style={thStyle}>Indikator Program</th>
                      <th style={{ ...thStyle, width: "64px" }}>Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pejabat.sasaran.map((s, i) => (
                      <tr key={i}>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                        <td style={tdStyle}>{s.program}</td>
                        <td style={tdStyle}>{s.indikator}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{s.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: "32px" }}>No</th>
                      <th style={thStyle}>Kegiatan</th>
                      <th style={thStyle}>Indikator</th>
                      <th style={{ ...thStyle, width: "100px" }}>Anggaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pejabat.kegiatan.map((k, i) => (
                      <tr key={i}>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                        <td style={tdStyle}>{k.nama}</td>
                        <td style={tdStyle}>{k.indikator}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(k.anggaran)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: "bold" }}>
                      <td colSpan={3} style={{ ...tdStyle, textAlign: "center" }}>TOTAL ANGGARAN</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}