// src/components/BelanjaSection.jsx
import React, { useMemo, useState } from "react";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v || 0));
}

export default function BelanjaSection({ currentRkaDetail, rkaForm, onSave, onCancel }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ nama: "", koef: 1, perhitungan: 1, harga_satuan: 0 });

  function addRow(e) {
    e?.preventDefault?.();
    const koef = Number(form.koef || 0);
    const perh = Number(form.perhitungan || 0);
    const harga = Number(form.harga_satuan || 0);
    const murni = koef * perh * harga;
    const r = { id: Date.now(), belanja: form.nama, koef, perhitungan: perh, harga_satuan: harga, murni, pergeseran_i: 0, pergeseran_ii: 0, efisiensi: 0, perubahan: 0 };
    setRows(prev => [...prev, r]);
    setForm({ nama: "", koef: 1, perhitungan: 1, harga_satuan: 0 });
  }

  function updateRow(id, patch) { setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function deleteRow(id) { if (!confirm("Hapus item?")) return; setRows(prev => prev.filter(r => r.id !== id)); }

  const totals = useMemo(() => {
    const t = { murni: 0, pergeseran_i: 0, pergeseran_ii: 0, efisiensi: 0, perubahan: 0 };
    rows.forEach(r => { t.murni += Number(r.murni || 0); t.pergeseran_i += Number(r.pergeseran_i || 0); t.pergeseran_ii += Number(r.pergeseran_ii || 0); t.efisiensi += Number(r.efisiensi || 0); t.perubahan += Number(r.perubahan || 0); });
    return t;
  }, [rows]);

  return (
    <section>
      <div className="mb-4 border rounded p-4">
        <div className="font-semibold">Informasi</div>
        <div className="text-sm">{currentRkaDetail.program?.name} / {currentRkaDetail.kegiatan?.name} / {currentRkaDetail.subkegiatan?.name}</div>
        <div className="text-sm">Pelaksana: {currentRkaDetail.pelaksana?.nama ?? "-"}</div>
      </div>

      <div className="border rounded p-4 mb-4">
        <h3 className="font-semibold mb-2">Form Tambah Belanja</h3>
        <form onSubmit={addRow} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Belanja (contoh: Pengadaan ATK)" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="border rounded p-2" />
          <input type="number" min="0" value={form.koef} onChange={e => setForm(f => ({ ...f, koef: e.target.value }))} className="border rounded p-2" />
          <input type="number" min="0" value={form.perhitungan} onChange={e => setForm(f => ({ ...f, perhitungan: e.target.value }))} className="border rounded p-2" />
          <input type="number" min="0" value={form.harga_satuan} onChange={e => setForm(f => ({ ...f, harga_satuan: e.target.value }))} className="border rounded p-2" />
          <div className="md:col-span-4 flex justify-end mt-2">
            <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Tambah</button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto border rounded mb-4">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50"><tr>
            <th className="px-3 py-2">Belanja</th><th className="px-3 py-2">Koef.</th><th className="px-3 py-2">Perkalian</th><th className="px-3 py-2">Harga</th><th className="px-3 py-2">Murni</th><th className="px-3 py-2">Pergeseran I</th><th className="px-3 py-2">Pergeseran II</th><th className="px-3 py-2">Efisiensi</th><th className="px-3 py-2">Perubahan</th><th className="px-3 py-2">Aksi</th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="px-3 py-2">{r.belanja}</td>
                <td className="px-3 py-2">{r.koef}</td>
                <td className="px-3 py-2">{r.perhitungan}</td>
                <td className="px-3 py-2">{fmtIdr(r.harga_satuan)}</td>
                <td className="px-3 py-2">{fmtIdr(r.murni)}</td>
                <td className="px-3 py-2"><input type="number" value={r.pergeseran_i} onChange={e => updateRow(r.id, { pergeseran_i: Number(e.target.value) })} className="w-24 border rounded p-1" /></td>
                <td className="px-3 py-2"><input type="number" value={r.pergeseran_ii} onChange={e => updateRow(r.id, { pergeseran_ii: Number(e.target.value) })} className="w-24 border rounded p-1" /></td>
                <td className="px-3 py-2"><input type="number" value={r.efisiensi} onChange={e => updateRow(r.id, { efisiensi: Number(e.target.value) })} className="w-24 border rounded p-1" /></td>
                <td className="px-3 py-2"><input type="number" value={r.perubahan} onChange={e => updateRow(r.id, { perubahan: Number(e.target.value) })} className="w-24 border rounded p-1" /></td>
                <td className="px-3 py-2"><button onClick={() => deleteRow(r.id)} className="text-red-600">Hapus</button></td>
              </tr>
            ))}
            <tr className="font-semibold bg-slate-100">
              <td className="px-3 py-2">TOTAL</td><td/><td/><td/><td className="px-3 py-2">{fmtIdr(totals.murni)}</td><td className="px-3 py-2">{fmtIdr(totals.pergeseran_i)}</td><td className="px-3 py-2">{fmtIdr(totals.pergeseran_ii)}</td><td className="px-3 py-2">{fmtIdr(totals.efisiensi)}</td><td className="px-3 py-2">{fmtIdr(totals.perubahan)}</td><td/>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onSave(rows)}>Selesai & Simpan</button>
        <button className="px-3 py-1 border rounded" onClick={onCancel}>Kembali</button>
      </div>
    </section>
  );
}
