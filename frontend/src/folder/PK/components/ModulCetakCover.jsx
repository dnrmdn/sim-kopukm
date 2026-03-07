import React, { useState } from "react";
import { Printer, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoverPerjanjianKinerjaPage() {
  const navigate = useNavigate();
  const [jenis, setJenis] = useState("PERGESERAN I");

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          /* Sembunyikan semua elemen di halaman secara display */
          body > *,
          #root > *,
          #root > * > * {
            display: none !important;
          }

          /* Tampilkan hanya cover */
          #cover-print {
            display: block !important;
            position: fixed !important;
            inset: 0 !important;
            width: 794px !important;
            height: 1123px !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            width: 794px !important;
            height: 1123px !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* Cover — id unik, satu-satunya yang dicetak */}
      <div
        id="cover-print"
        className="relative bg-white"
        style={{ display: "none" }}
      />

      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 overflow-x-hidden">

        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
        </div>

        {/* ── Sticky Header ── */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Cetak Cover Perjanjian Kinerja
                  </h1>
                </div>
                <p className="text-gray-500 text-sm pl-1">
                  Pilih jenis dokumen lalu cetak halaman sampul
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

        {/* ── Controls toolbar ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
          <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  Jenis Dokumen
                </label>
                <div className="relative">
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white/70 border border-blue-200 text-gray-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option>AKTIF</option>
                    <option>MURNI</option>
                    <option>PERGESERAN I</option>
                    <option>PERGESERAN II</option>
                    <option>EFISIENSI</option>
                    <option>PERUBAHAN</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-blue-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 8L1 3h10z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                <Printer size={16} />
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>

        {/* ── A4 Screen Preview ── */}
        <div className="flex justify-center px-4 pb-16">
          <div
            className="relative bg-white shadow-2xl"
            style={{ width: "794px", height: "1123px" }}
          >
            <A4Content jenis={jenis} />
          </div>
        </div>

      </div>

      {/* ── Print portal — di luar semua wrapper, langsung child of body via React portal workaround ── */}
      <PrintPortal jenis={jenis} />
    </>
  );
}

function A4Content({ jenis }) {
  return (
    <>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(#1e3a8a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between px-16 py-20">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-widest text-slate-700">
            PERJANJIAN KINERJA
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg font-bold">
            <span className="text-orange-600 border-b-2 border-orange-600 px-2">{jenis}</span>
            <span className="text-slate-600 border-b-2 border-slate-600 px-2">TAHUN 2026</span>
          </div>
        </div>
        <div className="flex justify-center">
          <img src="/icon_krw.png" alt="Logo Kabupaten" className="w-65" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-lg font-bold tracking-widest text-slate-700">
            DINAS KOPERASI DAN USAHA KECIL MENENGAH
          </h2>
          <p className="text-slate-600 font-semibold">KABUPATEN KARAWANG</p>
          <p className="text-slate-500">2026</p>
          <div className="pt-6 text-xs text-slate-400 border-t border-slate-200">
            Jl. A. Yani No. 7000, Karawang Barat • (0267) 123456 • dinkopukm@karawang.go.id
          </div>
        </div>
      </div>
      <div className="absolute inset-6 border-2 border-slate-400 pointer-events-none" />
    </>
  );
}

// Inject print-only div langsung ke body menggunakan React portal
import { createPortal } from "react-dom";

function PrintPortal({ jenis }) {
  const [el] = useState(() => {
    const div = document.createElement("div");
    div.id = "cover-print-portal";
    div.style.cssText = "display:none;position:fixed;inset:0;width:794px;height:1123px;background:white;z-index:99999;";
    return div;
  });

  React.useEffect(() => {
    document.body.appendChild(el);

    const style = document.createElement("style");
    style.id = "cover-print-style";
    style.textContent = `
      @media print {
        body > *:not(#cover-print-portal) { display: none !important; }
        #cover-print-portal {
          display: block !important;
          position: fixed !important;
          inset: 0 !important;
          width: 794px !important;
          height: 1123px !important;
          box-shadow: none !important;
          overflow: hidden !important;
        }
        @page { size: A4 portrait; margin: 0; }
        html, body { width: 794px !important; height: 1123px !important; overflow: hidden !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(el);
      document.head.removeChild(style);
    };
  }, [el]);

  return createPortal(
    <div
      style={{ width: "794px", height: "1123px", position: "relative", background: "white" }}
    >
      <A4Content jenis={jenis} />
    </div>,
    el
  );
}