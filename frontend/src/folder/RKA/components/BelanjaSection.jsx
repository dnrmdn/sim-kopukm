import React, { useMemo, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

/**
 * Formatter Mata Uang IDR
 */
function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(v || 0));
}

export default function BelanjaSection({ currentRkaDetail, rkaForm, onSave, onCancel, isEditMode, editingId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", koef: 1, perhitungan: 1, harga_satuan: 0 });

  /**
   * Identifikasi Jenis Pagu Aktif
   * 1: Murni, 2: P1, 3: P2, 4: Efisiensi, 5: Perubahan
   */
  const currentPaguType = String(rkaForm?.jenis_pagu || "1");

  // Load data belanja jika mode edit
  useEffect(() => {
    if (isEditMode && editingId) {
      fetchExistingBelanja();
    }
  }, [isEditMode, editingId]);

  async function fetchExistingBelanja() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/rka/${editingId}/belanja`);
      const mappedRows = res.data.map(item => ({
        id: item.id || Date.now() + Math.random(),
        belanja: item.belanja,
        koef: item.koef || "",
        perhitungan: Number(item.perhitungan || 0),
        harga_satuan: Number(item.harga_satuan || 0),
        murni: Number(item.murni || 0),
        pergeseran_i: Number(item.pergeseran_i || 0),
        pergeseran_ii: Number(item.pergeseran_ii || 0),
        efisiensi: Number(item.efisiensi || 0),
        perubahan: Number(item.perubahan || 0),
      }));
      setRows(mappedRows);
    } catch (err) {
      console.error("Gagal mengambil rincian belanja:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Menambahkan Baris Belanja Baru
   */
  function addRow(e) {
    e?.preventDefault?.();
    const vol = Number(form.perhitungan || 0);
    const harga = Number(form.harga_satuan || 0);
    const total = vol * harga;

    // Logika Pemetaan: Masukkan total ke kolom yang sesuai dengan jenis_pagu
    const newRow = {
      id: Date.now(),
      belanja: form.nama,
      koef: form.koef,
      perhitungan: vol,
      harga_satuan: harga,
      murni: currentPaguType === "1" ? total : 0,
      pergeseran_i: currentPaguType === "2" ? total : 0,
      pergeseran_ii: currentPaguType === "3" ? total : 0,
      efisiensi: currentPaguType === "4" ? total : 0,
      perubahan: currentPaguType === "5" ? total : 0,
    };

    setRows(prev => [...prev, newRow]);
    setForm({ nama: "", koef: 1, perhitungan: 1, harga_satuan: 0 });
  }

  /**
   * Update Baris (Kalkulasi Otomatis saat Vol/Harga diubah)
   */
  function updateRow(id, field, value) {
    setRows(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        // Hitung ulang total jika perhitungan atau harga berubah
        if (field === "perhitungan" || field === "harga_satuan") {
          const total = Number(updated.perhitungan) * Number(updated.harga_satuan);
          
          // Reset semua kolom pagu dulu
          updated.murni = 0;
          updated.pergeseran_i = 0;
          updated.pergeseran_ii = 0;
          updated.efisiensi = 0;
          updated.perubahan = 0;

          // Isi kolom yang sesuai jenis_pagu
          if (currentPaguType === "1") updated.murni = total;
          else if (currentPaguType === "2") updated.pergeseran_i = total;
          else if (currentPaguType === "3") updated.pergeseran_ii = total;
          else if (currentPaguType === "4") updated.efisiensi = total;
          else if (currentPaguType === "5") updated.perubahan = total;
        }
        return updated;
      }
      return r;
    }));
  }

  function deleteRow(id) {
    if (confirm("Hapus item ini?")) setRows(prev => prev.filter(r => r.id !== id));
  }

  const totals = useMemo(() => {
    return rows.reduce((acc, r) => ({
      murni: acc.murni + Number(r.murni || 0),
      p1: acc.p1 + Number(r.pergeseran_i || 0),
      p2: acc.p2 + Number(r.pergeseran_ii || 0),
      efs: acc.efs + Number(r.efisiensi || 0),
      ubah: acc.ubah + Number(r.perubahan || 0),
    }), { murni: 0, p1: 0, p2: 0, efs: 0, ubah: 0 });
  }, [rows]);

  const labelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1";
  const tableTh = "px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200";

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      {/* 1. Header Informasi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="font-black text-slate-800 tracking-tight uppercase">Detail Rincian Belanja</h3>
          </div>
          <div className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-black border border-amber-200 uppercase">
             Mode: {currentPaguType === "1" ? "Murni" : currentPaguType === "4" ? "Efisiensi" : "Pergeseran/Perubahan"}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className={labelStyle}>Sub Kegiatan</span>
            <p className="font-bold text-slate-700 uppercase">{currentRkaDetail?.subkegiatan?.name || "N/A"}</p>
          </div>
          <div className="md:text-right">
            <span className={labelStyle}>Tahun Anggaran</span>
            <p className="font-bold text-blue-600">{rkaForm?.tahun || "-"}</p>
          </div>
        </div>
      </div>

      {/* 2. Form Entry */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-xl shadow-slate-200">
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          Input Item Belanja Baru
        </h3>
        <form onSubmit={addRow} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Belanja</label>
            <input 
              value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition-all" 
              placeholder="Ketik uraian belanja..." required 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Koefisien</label>
            <input 
              value={form.koef} onChange={e => setForm(f => ({ ...f, koef: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="1 Org" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Volume</label>
            <input 
              type="number" value={form.perhitungan} onChange={e => setForm(f => ({ ...f, perhitungan: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Harga</label>
            <input 
              type="number" value={form.harga_satuan} onChange={e => setForm(f => ({ ...f, harga_satuan: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow-lg transition-all active:scale-95">
              TAMBAH
            </button>
          </div>
        </form>
      </div>

      {/* 3. Tabel Belanja */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-xs">
            <thead>
              <tr>
                <th className={tableTh}>Nama Belanja</th>
                <th className={`${tableTh} text-center`}>Koef</th>
                <th className={`${tableTh} text-center w-24`}>Vol</th>
                <th className={`${tableTh} text-center w-36`}>Harga Satuan</th>
                <th className={`${tableTh} text-right bg-blue-50 text-blue-700`}>Murni</th>
                <th className={`${tableTh} text-right`}>Geser I</th>
                <th className={`${tableTh} text-right`}>Geser II</th>
                <th className={`${tableTh} text-right`}>Efisiensi</th>
                <th className={`${tableTh} text-right bg-indigo-50 text-indigo-700`}>Perubahan</th>
                <th className={`${tableTh} text-center`}>Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 font-bold text-slate-700">{r.belanja}</td>
                  <td className="px-4 py-2 text-center text-slate-500">{r.koef}</td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" value={r.perhitungan} 
                      onChange={e => updateRow(r.id, "perhitungan", e.target.value)}
                      className="w-full bg-slate-100 border-none rounded-md px-2 py-1 text-center font-bold outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" value={r.harga_satuan} 
                      onChange={e => updateRow(r.id, "harga_satuan", e.target.value)}
                      className="w-full bg-slate-100 border-none rounded-md px-2 py-1 text-right font-bold outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  {/* Kolom Pagu - Hanya yang aktif yang menonjol */}
                  <td className={`px-4 py-2 text-right font-mono ${currentPaguType === "1" ? "font-black text-blue-600 bg-blue-50/30" : "text-slate-300"}`}>
                    {fmtIdr(r.murni)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${currentPaguType === "2" ? "font-black text-slate-700 bg-slate-50" : "text-slate-300"}`}>
                    {fmtIdr(r.pergeseran_i)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${currentPaguType === "3" ? "font-black text-slate-700 bg-slate-50" : "text-slate-300"}`}>
                    {fmtIdr(r.pergeseran_ii)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${currentPaguType === "4" ? "font-black text-orange-600 bg-orange-50/30" : "text-slate-300"}`}>
                    {fmtIdr(r.efisiensi)}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${currentPaguType === "5" ? "font-black text-indigo-600 bg-indigo-50/30" : "text-slate-300"}`}>
                    {fmtIdr(r.perubahan)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => deleteRow(r.id)} className="text-red-300 hover:text-red-500">✕</button>
                  </td>
                </tr>
              ))}
              {/* Baris Total */}
              <tr className="bg-slate-900 text-white font-bold">
                <td colSpan={4} className="px-4 py-4 text-[10px] tracking-widest uppercase">Total Terkalkulasi</td>
                <td className="px-4 py-4 text-right text-blue-400">{fmtIdr(totals.murni)}</td>
                <td className="px-4 py-4 text-right text-slate-400">{fmtIdr(totals.p1)}</td>
                <td className="px-4 py-4 text-right text-slate-400">{fmtIdr(totals.p2)}</td>
                <td className="px-4 py-4 text-right text-orange-400">{fmtIdr(totals.efs)}</td>
                <td className="px-4 py-4 text-right text-indigo-400">{fmtIdr(totals.ubah)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Action Bar (Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex justify-between items-center z-50">
        <button onClick={onCancel} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
          Batal & Kembali
        </button>
        <button 
          onClick={() => onSave(rows)}
          className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          {isEditMode ? "PERBARUI DATA" : "SIMPAN RKA"}
        </button>
      </div>
    </section>
  );
}