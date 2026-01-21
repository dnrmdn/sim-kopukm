import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/* ================= UTIL BLOCK ================= */
function Block({ children }) {
  return (
    <div className="pl-6 border-l border-slate-300 space-y-3">
      {children}
    </div>
  );
}

/* ================= HEADER ================= */
function Header({ title, level, activeLevel, setActiveLevel }) {
  const isOpen = activeLevel >= level;

  const onClick = () => {
    setActiveLevel((prev) => (prev >= level ? level - 1 : level));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
    >
      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      {title}
    </button>
  );
}

/* ================= LIST ================= */
function BulletList({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2 text-sm text-slate-800">
      {items.map((it, i) => (
        <li key={i} className="relative pl-4">
          <span className="absolute left-0 top-2 w-2 h-px bg-slate-400" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/* ================= MAIN ================= */
export default function HirarkiComponents({ data = {} }) {
  /* ===== PAYLOAD (ASLI) ===== */
  const payload =
    data.data && typeof data.data === "object" ? data.data : data;

  const visi = payload.visi || [];
  const misi = payload.misi || [];
  const tujuan_rpjmd = payload.tujuan_rpjmd || payload.tujuan || [];
  const sasaran = payload.sasaran_strategis || payload.sasaran || [];
  const tujuan_pd =
    payload.tujuan_pd ||
    payload.tujuan_perangkat_daerah ||
    payload.tujuanPerangkat ||
    [];
  const sasaran_pd =
    payload.sasaran_pd || payload.sasaranPerangkatDaerah || [];

  /* ===== STATE LEVEL ===== */
  const [activeLevel, setActiveLevel] = React.useState(1);

  return (
    <div className="space-y-4 text-sm leading-relaxed">

      {/* ================= VISI ================= */}
      <Header
        title="Visi RPJMD"
        level={1}
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
      />
      {activeLevel >= 1 && (
        <Block>
          <BulletList items={visi} />

          {/* ================= MISI ================= */}
          <Header
            title="Misi RPJMD"
            level={2}
            activeLevel={activeLevel}
            setActiveLevel={setActiveLevel}
          />
          {activeLevel >= 2 && (
            <Block>
              <BulletList items={misi} />

              {/* ================= TUJUAN RPJMD ================= */}
              <Header
                title="Tujuan RPJMD"
                level={3}
                activeLevel={activeLevel}
                setActiveLevel={setActiveLevel}
              />
              {activeLevel >= 3 && (
                <Block>
                  <BulletList items={tujuan_rpjmd} />

                  {/* ================= SASARAN STRATEGIS ================= */}
                  <Header
                    title="Sasaran Strategis RPJMD"
                    level={4}
                    activeLevel={activeLevel}
                    setActiveLevel={setActiveLevel}
                  />
                  {activeLevel >= 4 && (
                    <Block>
                      {sasaran.map((s, i) => (
                        <div key={i} className="space-y-2">
                          <div className="font-semibold text-slate-800">
                            {s.nama}
                          </div>
                          <BulletList items={s.indikator || []} />
                        </div>
                      ))}

                      {/* ================= TUJUAN PD ================= */}
                      <Header
                        title="Tujuan Perangkat Daerah"
                        level={5}
                        activeLevel={activeLevel}
                        setActiveLevel={setActiveLevel}
                      />
                      {activeLevel >= 5 && (
                        <Block>
                          {tujuan_pd.map((t, i) => (
                            <div key={i} className="space-y-2">
                              <div className="font-semibold text-slate-800">
                                {t.nama}
                              </div>
                              <BulletList items={t.indikator || []} />
                            </div>
                          ))}

                          {/* ================= SASARAN PD ================= */}
                          <Header
                            title="Sasaran Perangkat Daerah"
                            level={6}
                            activeLevel={activeLevel}
                            setActiveLevel={setActiveLevel}
                          />
                          {activeLevel >= 6 && (
                            <Block>
                              {sasaran_pd.map((s, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="font-semibold text-slate-800">
                                    {s.nama}
                                  </div>
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
  );
}
