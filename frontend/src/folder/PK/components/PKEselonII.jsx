import React, { useEffect } from "react";
import { Printer, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PerjanjianKinerjaFullPage() {
  const navigate = useNavigate();

  const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num);

  const data = {
    tahun: 2026,
    perangkat: "DINAS KOPERASI DAN USAHA KECIL MENENGAH KABUPATEN KARAWANG",
    kepala: "KADIN KOPERASI DAN UMKM",
    bupati: "H. AEP SYAEPULOH, SE",
    tanggal: "Karawang, 28 Februari 2026",
    sasaran: [
      {
        sasaran: "Meningkatnya umkm yang naik kelas menjadi industri",
        indikator: "Indeks Kinerja Utama Pemberdayaan Dan Pengawasan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        target: 80,
      },
    ],
    program: [
      {
        nama: "Program Pemberdayaan dan Pengawasan usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
        indikator: "Persentase Pemberdayaan Dan Pengawasan usaha Koperasi dan Usaha Mikro, Kecil, dan Menengah",
        anggaran: 120699000,
      },
      {
        nama: "Program Pembinaan Dan Pengembangan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        indikator: "Persentase Pembinaan Dan Pengembangan Usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah",
        anggaran: 936374300,
      },
      {
        nama: "Program Penguatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Permodalan Dan Peningkatan Kap",
        indikator: "Persentase Penguatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Permodalan Dan Peningkatan Kap",
        anggaran: 923097100,
      },
      {
        nama: "Program Peningkatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Pasar Dan Peningkatan Kap",
        indikator: "Persentase Peningkatan Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Akses Pasar Dan Peningkatan Kap",
        anggaran: 354565000,
      },
      {
        nama: "Program Peningkatan Pelaku usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Kapasitas Sumber Daya Manusia",
        indikator: "Persentase Peningkatan Pelaku usaha Koperasi Dan Usaha Mikro, Kecil, Dan Menengah Melalui Peningkatan Kapasitas Sumber Daya Manusia",
        anggaran: 6502165284,
      },
      {
        nama: "Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota",
        indikator: "Nilai RB General Perangkat Daerah",
        anggaran: 6425174100,
      },
    ],
  };

  const total = data.program.reduce((a, b) => a + b.anggaran, 0);

  // ── beforeprint / afterprint: sembunyikan semua kecuali #pk-pages ──
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "pk-print-style";
    styleEl.textContent = `
      @media print {
        @page { size: A4 portrait; margin: 0; }
        body > *                          { display: none !important; }
        body > #pk-pages                  { display: block !important; }
        #pk-pages .pk-page                { page-break-after: always; width: 794px; height: 1123px; overflow: hidden; }
        #pk-pages .pk-page:last-child     { page-break-after: avoid; }
      }
    `;
    document.head.appendChild(styleEl);

    // Pindahkan #pk-pages langsung ke body saat mount
    const pagesEl = document.getElementById("pk-pages");
    if (pagesEl) document.body.appendChild(pagesEl);

    return () => {
      // Kembalikan ke dalam root saat unmount agar React tidak error
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
                    Perjanjian Kinerja Eselon II
                  </h1>
                </div>
                <p className="text-gray-500 text-sm pl-1">
                  {data.perangkat} — Tahun {data.tahun}
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
            <div className="p-5 flex justify-end">
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

        {/* Screen Preview (copy tampilan, tidak diprint) */}
        <div className="flex flex-col items-center gap-6 px-4 pb-16">

          {/* Preview Halaman 1 */}
          <div className="bg-white shadow-2xl" style={{ width: "794px", minHeight: "1123px" }}>
            <div style={{ padding: "96px 80px", fontSize: "14px", lineHeight: "1.6" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <img src="/icon_krw.png" style={{ height: "96px" }} alt="Logo" />
              </div>
              <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "24px" }}>
                <p>PERJANJIAN KINERJA (PAGU AKTIF)</p>
                <p>{data.perangkat}</p>
                <p>TAHUN {data.tahun}</p>
              </div>
              <p style={{ textAlign: "justify", marginBottom: "24px" }}>
                Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan dan akuntabel
                serta berorientasi pada hasil, kami yang bertanda tangan di bawah ini:
              </p>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {data.kepala}</div></div>
                <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Kepala Badan</div></div>
              </div>
              <p style={{ marginBottom: "16px" }}>Selanjutnya disebut PIHAK KESATU.</p>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {data.bupati}</div></div>
                <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Bupati Karawang</div></div>
              </div>
              <p style={{ marginBottom: "24px" }}>Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.</p>
              <p style={{ textAlign: "justify" }}>
                PIHAK KESATU berjanji akan mewujudkan target kinerja yang seharusnya sesuai perjanjian ini,
                dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam
                dokumen perencanaan. Keberhasilan dan kegagalan pencapaian target kinerja tersebut menjadi
                tanggung jawab PIHAK KESATU.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "96px" }}>
                <div style={{ textAlign: "center" }}>
                  <p>PIHAK KEDUA,</p>
                  <div style={{ height: "96px" }} />
                  <p style={{ fontWeight: "bold" }}>{data.bupati}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p>{data.tanggal}</p>
                  <p>PIHAK KESATU,</p>
                  <div style={{ height: "96px" }} />
                  <p style={{ fontWeight: "bold" }}>{data.kepala}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Halaman 2 */}
          <div className="bg-white shadow-2xl" style={{ width: "794px", minHeight: "1123px" }}>
            <div style={{ padding: "80px 64px", fontSize: "13px" }}>
              <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
                PERJANJIAN KINERJA TAHUN {data.tahun} (PAGU AKTIF)<br />
                KEPALA {data.perangkat}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: "32px" }}>No</th>
                    <th style={thStyle}>Sasaran Strategis</th>
                    <th style={thStyle}>Indikator</th>
                    <th style={{ ...thStyle, width: "64px" }}>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sasaran.map((item, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                      <td style={tdStyle}>{item.sasaran}</td>
                      <td style={tdStyle}>{item.indikator}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{item.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: "32px" }}>No</th>
                    <th style={thStyle}>Program</th>
                    <th style={thStyle}>Indikator Program</th>
                    <th style={{ ...thStyle, width: "100px" }}>Anggaran</th>
                  </tr>
                </thead>
                <tbody>
                  {data.program.map((item, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                      <td style={tdStyle}>{item.nama}</td>
                      <td style={tdStyle}>{item.indikator}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(item.anggaran)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center" }}>TOTAL ANGGARAN</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(total)}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "64px" }}>
                <div style={{ textAlign: "center" }}>
                  <p>PEJABAT PENILAI,</p>
                  <div style={{ height: "80px" }} />
                  <p style={{ fontWeight: "bold" }}>{data.bupati}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p>KEPALA BADAN</p>
                  <div style={{ height: "80px" }} />
                  <p style={{ fontWeight: "bold" }}>{data.kepala}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Print-only pages — dipindahkan langsung ke body via useEffect ── */}
      <div id="pk-pages" style={{ display: "none" }}>

        {/* Halaman 1 print */}
        <div className="pk-page" style={{ background: "white", boxSizing: "border-box", padding: "96px 80px", fontSize: "14px", lineHeight: "1.6" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <img src="/icon_krw.png" style={{ height: "96px" }} alt="Logo" />
          </div>
          <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "24px" }}>
            <p>PERJANJIAN KINERJA (PAGU AKTIF)</p>
            <p>{data.perangkat}</p>
            <p>TAHUN {data.tahun}</p>
          </div>
          <p style={{ textAlign: "justify", marginBottom: "24px" }}>
            Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan dan akuntabel
            serta berorientasi pada hasil, kami yang bertanda tangan di bawah ini:
          </p>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {data.kepala}</div></div>
            <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Kepala Badan</div></div>
          </div>
          <p style={{ marginBottom: "16px" }}>Selanjutnya disebut PIHAK KESATU.</p>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", marginBottom: "8px" }}><div style={{ width: "112px" }}>Nama</div><div>: {data.bupati}</div></div>
            <div style={{ display: "flex" }}><div style={{ width: "112px" }}>Jabatan</div><div>: Bupati Karawang</div></div>
          </div>
          <p style={{ marginBottom: "24px" }}>Selaku atasan langsung PIHAK KESATU, selanjutnya disebut PIHAK KEDUA.</p>
          <p style={{ textAlign: "justify" }}>
            PIHAK KESATU berjanji akan mewujudkan target kinerja yang seharusnya sesuai perjanjian ini,
            dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam
            dokumen perencanaan. Keberhasilan dan kegagalan pencapaian target kinerja tersebut menjadi
            tanggung jawab PIHAK KESATU.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "96px" }}>
            <div style={{ textAlign: "center" }}>
              <p>PIHAK KEDUA,</p><div style={{ height: "96px" }} /><p style={{ fontWeight: "bold" }}>{data.bupati}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p>{data.tanggal}</p><p>PIHAK KESATU,</p><div style={{ height: "96px" }} /><p style={{ fontWeight: "bold" }}>{data.kepala}</p>
            </div>
          </div>
        </div>

        {/* Halaman 2 print */}
        <div className="pk-page" style={{ background: "white", boxSizing: "border-box", padding: "80px 64px", fontSize: "13px" }}>
          <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
            PERJANJIAN KINERJA TAHUN {data.tahun} (PAGU AKTIF)<br />
            KEPALA {data.perangkat}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "32px" }}>No</th>
                <th style={thStyle}>Sasaran Strategis</th>
                <th style={thStyle}>Indikator</th>
                <th style={{ ...thStyle, width: "64px" }}>Target</th>
              </tr>
            </thead>
            <tbody>
              {data.sasaran.map((item, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                  <td style={tdStyle}>{item.sasaran}</td>
                  <td style={tdStyle}>{item.indikator}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{item.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "32px" }}>No</th>
                <th style={thStyle}>Program</th>
                <th style={thStyle}>Indikator Program</th>
                <th style={{ ...thStyle, width: "100px" }}>Anggaran</th>
              </tr>
            </thead>
            <tbody>
              {data.program.map((item, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                  <td style={tdStyle}>{item.nama}</td>
                  <td style={tdStyle}>{item.indikator}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(item.anggaran)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={3} style={{ ...tdStyle, textAlign: "center" }}>TOTAL ANGGARAN</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{formatNumber(total)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "64px" }}>
            <div style={{ textAlign: "center" }}>
              <p>PEJABAT PENILAI,</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{data.bupati}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p>KEPALA BADAN</p><div style={{ height: "80px" }} /><p style={{ fontWeight: "bold" }}>{data.kepala}</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}