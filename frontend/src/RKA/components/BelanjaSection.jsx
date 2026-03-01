// src/components/BelanjaSection.jsx
import React, { useMemo, useState } from "react";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(Number(v || 0));
}

export default function BelanjaSection({ currentRkaDetail, rkaForm, onSave, onCancel }) {
  // --- LOGIC: TIDAK DISENTUH ---
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
    rows.forEach(r => { 
      t.murni += Number(r.murni || 0); 
      t.pergeseran_i += Number(r.pergeseran_i || 0); 
      t.pergeseran_ii += Number(r.pergeseran_ii || 0); 
      t.efisiensi += Number(r.efisiensi || 0); 
      t.perubahan += Number(r.perubahan || 0); 
    });
    return t;
  }, [rows]);
  // --- END LOGIC ---

  const labelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1";
  const tableTh = "px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200";

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Informasi Kegiatan (Context) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="font-black text-slate-800 tracking-tight">INFORMASI KEGIATAN</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className={labelStyle}>Program / Kegiatan</span>
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {currentRkaDetail.program?.name} <span className="text-slate-300 mx-1">/</span> {currentRkaDetail.kegiatan?.name}
              </p>
            </div>
            <div>
              <span className={labelStyle}>Sub Kegiatan</span>
              <p className="text-sm font-bold text-blue-700 uppercase tracking-tight">{currentRkaDetail.subkegiatan?.name}</p>
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-center border-l border-slate-100 md:pl-6">
            <span className={labelStyle}>Pelaksana Lapangan</span>
            <p className="text-base font-bold text-slate-700">{currentRkaDetail.pelaksana?.nama ?? "Belum Ditentukan"}</p>
            <p className="text-xs text-slate-400 font-medium">{currentRkaDetail.pelaksana?.jabatan || "-"}</p>
          </div>
        </div>
      </div>

      {/* 2. Form Tambah Item - SEKARANG MENGGUNAKAN ABU-ABU CERAH */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm">
        <h3 className="text-slate-700 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Entry Rincian Belanja Baru
        </h3>
        <form onSubmit={addRow} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Belanja</label>
            <input 
              placeholder="Contoh: Honorarium Narasumber..." 
              value={form.nama} 
              onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} 
              className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              required 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Koefisien</label>
            <input type="number" min="0" value={form.koef} onChange={e => setForm(f => ({ ...f, koef: e.target.value }))} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perhitungan</label>
            <input type="number" min="0" value={form.perhitungan} onChange={e => setForm(f => ({ ...f, perhitungan: e.target.value }))} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Satuan</label>
            <input type="number" min="0" value={form.harga_satuan} onChange={e => setForm(f => ({ ...f, harga_satuan: e.target.value }))} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              TAMBAH
            </button>
          </div>
        </form>
      </div>

      {/* 3. Tabel Daftar Belanja */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className={tableTh}>Nama Belanja</th>
                <th className={`${tableTh} text-center`}>Koef</th>
                <th className={`${tableTh} text-center`}>Perkalian</th>
                <th className={`${tableTh} text-right`}>Harga</th>
                <th className={`${tableTh} text-right bg-blue-50/50 text-blue-700`}>Murni</th>
                <th className={tableTh}>Geser I</th>
                <th className={tableTh}>Geser II</th>
                <th className={tableTh}>Efisiensi</th>
                <th className={`${tableTh} bg-indigo-50/50 text-indigo-700`}>Perubahan</th>
                <th className={`${tableTh} text-center`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-slate-400 italic text-sm">
                    Belum ada item belanja yang ditambahkan.
                  </td>
                </tr>
              )}
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">{r.belanja}</td>
                  <td className="px-4 py-3 text-sm text-center text-slate-500 font-mono">{r.koef}</td>
                  <td className="px-4 py-3 text-sm text-center text-slate-500 font-mono">{r.perhitungan}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600 font-mono">{fmtIdr(r.harga_satuan)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-blue-600 bg-blue-50/20 font-mono">{fmtIdr(r.murni)}</td>
                  
                  <td className="px-4 py-3">
                    <input type="number" value={r.pergeseran_i} onChange={e => updateRow(r.id, { pergeseran_i: Number(e.target.value) })} className="w-24 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-mono outline-none focus:border-blue-500" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={r.pergeseran_ii} onChange={e => updateRow(r.id, { pergeseran_ii: Number(e.target.value) })} className="w-24 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-mono outline-none focus:border-blue-500" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={r.efisiensi} onChange={e => updateRow(r.id, { efisiensi: Number(e.target.value) })} className="w-24 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-mono outline-none focus:border-blue-500" />
                  </td>
                  <td className="px-4 py-3 bg-indigo-50/20">
                    <input type="number" value={r.perubahan} onChange={e => updateRow(r.id, { perubahan: Number(e.target.value) })} className="w-24 bg-white border border-indigo-200 rounded-md px-2 py-1 text-xs font-bold font-mono text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button onClick={() => deleteRow(r.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Footer Total - SEKARANG MENGGUNAKAN ABU-ABU CERAH */}
              <tr className="bg-slate-100 text-slate-700 font-bold border-t-2 border-slate-200">
                <td className="px-4 py-4 text-xs tracking-widest uppercase">TOTAL KESELURUHAN</td>
                <td colSpan={3} className="border-r border-slate-200"></td>
                <td className="px-4 py-4 text-right text-blue-700 font-mono">{fmtIdr(totals.murni)}</td>
                <td className="px-4 py-4 text-right text-slate-500 font-mono text-xs">{fmtIdr(totals.pergeseran_i)}</td>
                <td className="px-4 py-4 text-right text-slate-500 font-mono text-xs">{fmtIdr(totals.pergeseran_ii)}</td>
                <td className="px-4 py-4 text-right text-orange-600 font-mono text-xs">{fmtIdr(totals.efisiensi)}</td>
                <td className="px-4 py-4 text-right text-indigo-700 font-mono">{fmtIdr(totals.perubahan)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Footer Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button 
          onClick={onCancel} 
          className="w-full md:w-auto px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Daftar
        </button>
        <button 
          className="w-full md:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3" 
          onClick={() => onSave(rows)}
        >
          SELESAI & SIMPAN RKA
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        </button>
      </div>

    </section>
  );
}