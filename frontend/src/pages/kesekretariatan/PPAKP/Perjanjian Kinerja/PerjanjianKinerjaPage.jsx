import React from "react";
import { FileText, Award, ClipboardCheck, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PerjanjianKinerjaPage() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "Cetak Cover Perjanjian Kinerja",
      desc: "Halaman sampul dokumen PK",
      icon: <FileText size={28} />,
      color: "bg-blue-100 text-blue-600",
      path: "/dokumen/cetak-cover",
    },
    {
      title: "Cetak Perjanjian Kinerja Eselon II",
      desc: "Dokumen PK tingkat eselon II",
      icon: <Award size={28} />,
      color: "bg-red-100 text-red-600",
      path: "/pk/eselon-ii",
    },
    {
      title: "Cetak Perjanjian Kinerja Eselon III",
      desc: "Dokumen PK tingkat eselon III",
      icon: <ClipboardCheck size={28} />,
      color: "bg-indigo-100 text-indigo-600",
      path: "/pk/eselon-iii",
    },
    {
      title: "Cetak Perjanjian Kinerja Eselon IV",
      desc: "Dokumen PK tingkat eselon IV",
      icon: <Layers size={28} />,
      color: "bg-emerald-100 text-emerald-600",
      path: "/pk/eselon-iv",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-2 bg-blue-600 rounded-full" />
            <span className="text-xs font-black tracking-[0.3em] text-blue-600 uppercase">
              Dokumen Kinerja
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-800">
            PERJANJIAN KINERJA
          </h1>

          <p className="text-slate-400 font-semibold text-sm uppercase tracking-widest">
            Pilih jenis dokumen yang ingin Anda cetak
          </p>
        </header>

        {/* MENU GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menus.map((menu, index) => (
            <div
              key={index}
              onClick={() => navigate(menu.path)}
              className="group bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center ${menu.color} shadow-md group-hover:scale-110 transition-transform`}
                >
                  {menu.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {menu.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-semibold">
                    {menu.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* INFO SECTION */}
        <section className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText size={26} />
          </div>
          <h3 className="font-black uppercase tracking-wider text-slate-700">
            Informasi
          </h3>
          <p className="text-slate-400 font-semibold text-sm">
            Sistem Manajemen Perjanjian Kinerja <br />
            Badan Kesatuan Bangsa dan Politik
          </p>
        </section>

        {/* FOOTER */}
        <footer className="pt-6 pb-10 text-center">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">
            © 2026 E-Planning Dinkopukm Karawang • Ver 2.1
          </p>
        </footer>
      </div>
    </div>
  );
}