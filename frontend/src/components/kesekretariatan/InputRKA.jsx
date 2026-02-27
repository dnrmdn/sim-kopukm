import React from "react";

export default function InputRKA({
  renstraPrograms = [],
  kegiatanOptions = [],
  subkegiatanOptions = [],
  pegawaiList = [],
  satuanList = [],
  rkaForm,
  onChangeForm,
  onClose,
  onSubmit,
}) {
  const labelStyle =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] grid place-items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              INPUT RKA
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-tighter">
              Alokasi Program & Sub Kegiatan Baru
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[75vh] overflow-y-auto">
          <div className="p-8 space-y-8">

            {/* ===================== */}
            {/* Section 1: Struktur */}
            {/* ===================== */}
            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                  01
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Struktur Anggaran
                </h4>
              </div>

              <div>
                <label className={labelStyle}>Program Utama</label>
                <select
                  value={rkaForm.program_id ?? ""}
                  onChange={(e) => {
                    onChangeForm("program_id", e.target.value || null);
                    onChangeForm("kegiatan_id", null);
                    onChangeForm("subkegiatan_id", null);
                  }}
                  className={inputStyle}
                >
                  <option value="">
                    {renstraPrograms.length
                      ? "-- pilih program --"
                      : "Tidak ada program"}
                  </option>
                  {renstraPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.kodering ? `${p.kodering} — ${p.name}` : p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Nama Kegiatan</label>
                <select
                  value={rkaForm.kegiatan_id ?? ""}
                  onChange={(e) => {
                    onChangeForm("kegiatan_id", e.target.value || null);
                    onChangeForm("subkegiatan_id", null);
                  }}
                  className={inputStyle}
                  disabled={!kegiatanOptions.length}
                >
                  <option value="">
                    {kegiatanOptions.length
                      ? "-- pilih kegiatan --"
                      : "Pilih program dulu"}
                  </option>
                  {kegiatanOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.kodering ? `${k.kodering} — ${k.name}` : k.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Sub Kegiatan</label>
                <select
                  value={rkaForm.subkegiatan_id ?? ""}
                  onChange={(e) =>
                    onChangeForm("subkegiatan_id", e.target.value || null)
                  }
                  className={inputStyle}
                  disabled={!subkegiatanOptions.length}
                >
                  <option value="">
                    {subkegiatanOptions.length
                      ? "-- pilih sub kegiatan --"
                      : "Pilih kegiatan dulu"}
                  </option>
                  {subkegiatanOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.kodering ? `${s.kodering} — ${s.name}` : s.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* ===================== */}
            {/* Section 2: Detail */}
            {/* ===================== */}
            <section className="space-y-5 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                  02
                </span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Detail Pelaksanaan
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div>
                  <label className={labelStyle}>Target (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rkaForm.target_sub ?? ""}
                    onChange={(e) =>
                      onChangeForm("target_sub", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>

                {/* ✅ JENIS PAGU */}
                <div>
                  <label className={labelStyle}>Jenis Pagu</label>
                  <select
                    value={rkaForm.jenis_pagu ?? ""}
                    onChange={(e) =>
                      onChangeForm("jenis_pagu", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option value="">-- pilih jenis pagu --</option>
                    <option value="MURNI">MURNI</option>
                    <option value="PERGESERAN_I">PERGESERAN I</option>
                    <option value="PERGESERAN_II">PERGESERAN II</option>
                    <option value="EFISIENSI">EFISIENSI</option>
                    <option value="PERUBAHAN">PERUBAHAN</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Satuan</label>
                  <select
                    value={rkaForm.satuan ?? ""}
                    onChange={(e) => onChangeForm("satuan", e.target.value)}
                    className={inputStyle}
                  >
                    <option value="">-- pilih satuan --</option>
                    {satuanList.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Penanggung Jawab</label>
                  <select
                    value={rkaForm.penanggungjawab_id ?? ""}
                    onChange={(e) =>
                      onChangeForm("penanggungjawab_id", e.target.value || null)
                    }
                    className={inputStyle}
                  >
                    <option value="">-- pilih PJ --</option>
                    {pegawaiList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Pelaksana</label>
                  <select
                    value={rkaForm.pelaksana_id ?? ""}
                    onChange={(e) =>
                      onChangeForm("pelaksana_id", e.target.value || null)
                    }
                    className={inputStyle}
                  >
                    <option value="">-- pilih pelaksana --</option>
                    {pegawaiList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Tanggal Mulai</label>
                  <input
                    type="date"
                    value={rkaForm.tanggal_mulai ?? ""}
                    onChange={(e) =>
                      onChangeForm("tanggal_mulai", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Tanggal Selesai</label>
                  <input
                    type="date"
                    value={rkaForm.tanggal_selesai ?? ""}
                    onChange={(e) =>
                      onChangeForm("tanggal_selesai", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Lanjut Ke Input Belanja →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}