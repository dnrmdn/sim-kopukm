// src/components/InputRKA.jsx
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
  return (
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-start p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Input RKA</h3>
            <div className="text-sm text-gray-500">Pilih Program → Kegiatan → Sub Kegiatan</div>
          </div>
          <button onClick={onClose} className="text-slate-600">Tutup</button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          {/* Program */}
          <div>
            <label className="block text-sm">Program</label>
            <select value={rkaForm.program_id ?? ""} onChange={(e) => { onChangeForm("program_id", e.target.value || null); onChangeForm("kegiatan_id", null); onChangeForm("subkegiatan_id", null); }} className="w-full border rounded p-2">
              <option value="">{renstraPrograms.length ? "-- pilih program --" : "Tidak ada program (cek backend)"}</option>
              {renstraPrograms.map((p) => <option key={p.id} value={p.id}>{p.kodering ? `${p.kodering} — ${p.name}` : p.name}</option>)}
            </select>
          </div>

          {/* Kegiatan */}
          <div>
            <label className="block text-sm">Kegiatan</label>
            <select value={rkaForm.kegiatan_id ?? ""} onChange={(e) => { onChangeForm("kegiatan_id", e.target.value || null); onChangeForm("subkegiatan_id", null); }} className="w-full border rounded p-2" disabled={kegiatanOptions.length === 0}>
              <option value="">{kegiatanOptions.length ? "-- pilih kegiatan --" : "Pilih program dulu"}</option>
              {kegiatanOptions.map((k) => <option key={k.id} value={k.id}>{k.kodering ? `${k.kodering} — ${k.name}` : k.name}</option>)}
            </select>
          </div>

          {/* Sub Kegiatan */}
          <div>
            <label className="block text-sm">Sub Kegiatan</label>
            <select value={rkaForm.subkegiatan_id ?? ""} onChange={(e) => onChangeForm("subkegiatan_id", e.target.value || null)} className="w-full border rounded p-2" disabled={subkegiatanOptions.length === 0}>
              <option value="">{subkegiatanOptions.length ? "-- pilih sub kegiatan --" : "Pilih kegiatan dulu"}</option>
              {subkegiatanOptions.map((s) => <option key={s.id} value={s.id}>{s.kodering ? `${s.kodering} — ${s.name}` : s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm">Target Sub Kegiatan</label>
              <input type="number" min="0" max="100" value={rkaForm.target_sub ?? ""} onChange={(e) => onChangeForm("target_sub", e.target.value)} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm">Pilih Satuan</label>
              <select value={rkaForm.satuan ?? ""} onChange={(e) => onChangeForm("satuan", e.target.value)} className="w-full border rounded p-2">
                <option value="">{satuanList.length ? "-- pilih satuan --" : "Tidak ada satuan"}</option>
                {satuanList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm">Penanggung Jawab</label>
              <select value={rkaForm.penanggungjawab_id ?? ""} onChange={(e) => onChangeForm("penanggungjawab_id", e.target.value || null)} className="w-full border rounded p-2">
                <option value="">{pegawaiList.length ? "-- pilih PJ --" : "Tidak ada pegawai"}</option>
                {pegawaiList.map(p => <option key={p.id} value={p.id}>{p.nama} — {p.jabatan}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm">Pelaksana</label>
              <select value={rkaForm.pelaksana_id ?? ""} onChange={(e) => onChangeForm("pelaksana_id", e.target.value || null)} className="w-full border rounded p-2">
                <option value="">{pegawaiList.length ? "-- pilih pelaksana --" : "Tidak ada pegawai"}</option>
                {pegawaiList.map(p => <option key={p.id} value={p.id}>{p.nama} — {p.jabatan}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm">Tanggal Pelaksanaan (Dari)</label>
              <input type="date" value={rkaForm.tanggal_mulai ?? ""} onChange={(e) => onChangeForm("tanggal_mulai", e.target.value)} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm">Tanggal Pelaksanaan (Sampai)</label>
              <input type="date" value={rkaForm.tanggal_selesai ?? ""} onChange={(e) => onChangeForm("tanggal_selesai", e.target.value)} className="w-full border rounded p-2" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Batal</button>
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Lanjut Ke Input Belanja</button>
          </div>
        </form>
      </div>
    </div>
  );
}
