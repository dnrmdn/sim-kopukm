import React from "react";
import { ChevronDown, ChevronRight, Target, Flag, Building2, LayoutGrid, CircleDot } from "lucide-react";

/* ================= UTIL BLOCK ================= */
function Block({ children }) {
  return (
    // Garis vertikal dibuat lebih tegas untuk memperlihatkan alur hirarki
    <div className="ml-4 pl-6 border-l-2 border-slate-200 space-y-4 py-2 my-1 transition-all">
      {children}
    </div>
  );
}

/* ================= HEADER ================= */
function Header({ title, level, activeLevel, setActiveLevel, icon: Icon }) {
  const isOpen = activeLevel >= level;
  const isActiveRow = activeLevel === level;

  const onClick = () => {
    setActiveLevel((prev) => (prev >= level ? level - 1 : level));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 
        ${isActiveRow ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : 'hover:bg-slate-100 text-slate-600'}`}
    >
      <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
        <ChevronDown size={16} className={isActiveRow ? 'text-blue-600' : 'text-slate-400'} />
      </div>
      
      {Icon && <Icon size={18} className={isActiveRow ? 'text-blue-700' : 'text-slate-500'} />}
      
      <span className={`text-[13px] font-bold tracking-tight uppercase ${isActiveRow ? 'text-blue-900' : 'text-slate-700'}`}>
        {title}
      </span>
    </button>
  );
}

/* ================= LIST ================= */
function BulletList({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 group">
          <CircleDot size={8} className="mt-1.5 text-blue-400 flex-shrink-0 group-hover:scale-125 transition-transform" />
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {it}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ================= MAIN ================= */
export default function HirarkiComponents({ data = {} }) {
  const payload = data.data && typeof data.data === "object" ? data.data : data;

  const visi = payload.visi || [];
  const misi = payload.misi || [];
  const tujuan_rpjmd = payload.tujuan_rpjmd || payload.tujuan || [];
  const sasaran = payload.sasaran_strategis || payload.sasaran || [];
  const tujuan_pd = payload.tujuan_pd || payload.tujuan_perangkat_daerah || [];
  const sasaran_pd = payload.sasaran_pd || payload.sasaranPerangkatDaerah || [];

  const [activeLevel, setActiveLevel] = React.useState(1);

  return (
    // "mx-0" dan "w-full" memastikan komponen rapat ke kiri
    <div className="w-full max-w-5xl mx-0 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="mb-8 border-l-4 border-blue-600 pl-4">
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">Pohon Kinerja</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Cascading Perencanaan Daerah</p>
      </div>

      <div className="flex flex-col items-start space-y-1">
        {/* LEVEL 1: VISI */}
        <Header title="Visi RPJMD" level={1} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={Flag} />
        {activeLevel >= 1 && (
          <Block>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-2">
               <BulletList items={visi} />
            </div>

            {/* LEVEL 2: MISI */}
            <Header title="Misi RPJMD" level={2} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={LayoutGrid} />
            {activeLevel >= 2 && (
              <Block>
                <div className="bg-white p-2 border-b border-slate-100">
                  <BulletList items={misi} />
                </div>

                {/* LEVEL 3: TUJUAN */}
                <Header title="Tujuan RPJMD" level={3} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={Target} />
                {activeLevel >= 3 && (
                  <Block>
                    <BulletList items={tujuan_rpjmd} />

                    {/* LEVEL 4: SASARAN STRATEGIS */}
                    <Header title="Sasaran Strategis" level={4} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={Target} />
                    {activeLevel >= 4 && (
                      <Block>
                        <div className="space-y-4">
                          {sasaran.map((s, i) => (
                            <div key={i} className="pl-4 border-l-2 border-blue-400">
                              <div className="text-sm font-bold text-slate-800 mb-2 italic">"{s.nama}"</div>
                              <BulletList items={s.indikator || []} />
                            </div>
                          ))}
                        </div>

                        {/* LEVEL 5: TUJUAN PD */}
                        <Header title="Tujuan Perangkat Daerah" level={5} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={Building2} />
                        {activeLevel >= 5 && (
                          <Block>
                            {tujuan_pd.map((t, i) => (
                              <div key={i} className="mb-4 bg-blue-50/50 p-3 rounded-md border border-blue-100">
                                <div className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">{t.nama}</div>
                                <BulletList items={t.indikator || []} />
                              </div>
                            ))}

                            {/* LEVEL 6: SASARAN PD */}
                            <Header title="Sasaran Perangkat Daerah" level={6} activeLevel={activeLevel} setActiveLevel={setActiveLevel} icon={Building2} />
                            {activeLevel >= 6 && (
                              <Block>
                                {sasaran_pd.map((s, i) => (
                                  <div key={i} className="mb-3 p-3 bg-white border border-slate-200 rounded shadow-sm">
                                    <div className="text-sm font-bold text-slate-700 mb-1 leading-snug">{s.nama}</div>
                                    <BulletList items={s.indikator || []} />
                                  </div>
                                ))}
                              </Block>
                            )}
                          </Block>
                        )}
                      </Block>
                    )}
                  </Block>
                )}
              </Block>
            )}
          </Block>
        )}
      </div>
    </div>
  );
}