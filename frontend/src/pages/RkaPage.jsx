// src/pages/RkaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import InputRKA from "../components/InputRKA";
import BelanjaSection from "../components/BelanjaSection";
import RkaTable from "../components/RkaTable";

function formatIdr(x) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(x || 0));
}

export default function RkaPage() {
  const defaultYear = new Date().getFullYear() + 1; // default ke next year (biasanya 2026)
  const [year, setYear] = useState(defaultYear);
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1, y + 2, y + 3, y + 4];
  }, []);

  // master data
  const [renstraPrograms, setRenstraPrograms] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);

  // UI states
  const [loadingMasters, setLoadingMasters] = useState(true);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showBelanjaStep, setShowBelanjaStep] = useState(false);

  // RKA flow
  const [rkaForm, setRkaForm] = useState({
    program_id: null,
    kegiatan_id: null,
    subkegiatan_id: null,
    target_sub: "",
    satuan: "",
    penanggungjawab_id: null,
    pelaksana_id: null,
    tanggal_mulai: "",
    tanggal_selesai: "",
  });
  const [currentRkaDetail, setCurrentRkaDetail] = useState(null);
  const [rkaTableData, setRkaTableData] = useState([]);

  useEffect(() => {
    loadAllMasters();
    fetchRkaTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAllMasters() {
    setLoadingMasters(true);
    try {
      await Promise.all([fetchRenstra(), fetchPegawai(), fetchSatuan()]);
    } catch (err) {
      console.error("loadAllMasters error", err);
    } finally {
      setLoadingMasters(false);
    }
  }

  // tolerant fetch: handle res.data being array or { data: [...] } or { programs: [...] }
  async function fetchRenstra() {
    try {
      // adjust endpoint if your backend uses /programs or /renstra/programs
      const res = await axiosInstance.get("/renstra/programs");
      console.log("fetchRenstra raw:", res.data);
      const programs = Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.programs ?? []);
      setRenstraPrograms(programs);
    } catch (err) {
      console.error("fetchRenstra failed", err);
      setRenstraPrograms([]);
    }
  }

  async function fetchPegawai() {
    try {
      const res = await axiosInstance.get("/pegawai");
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setPegawaiList(arr);
      console.log("fetchPegawai:", arr);
    } catch (err) {
      console.error("fetchPegawai failed", err);
      setPegawaiList([]);
    }
  }

  async function fetchSatuan() {
    try {
      const res = await axiosInstance.get("/renstra/satuans");
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setSatuanList(arr);
      console.log("fetchSatuan:", arr);
    } catch (err) {
      console.error("fetchSatuan failed", err);
      setSatuanList([]);
    }
  }

  async function fetchRkaTable(y = year) {
    try {
      const res = await axiosInstance.get(`/rka?year=${y}`);
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setRkaTableData(arr);
      console.log("fetchRkaTable:", arr);
    } catch (err) {
      console.error("fetchRkaTable failed", err);
      setRkaTableData([]);
    }
  }

  function onChangeForm(key, value) {
    setRkaForm((prev) => ({ ...prev, [key]: value }));
  }

  const kegiatanOptions = useMemo(() => {
    if (!rkaForm.program_id) return [];
    const p = renstraPrograms.find((x) => Number(x.id) === Number(rkaForm.program_id));
    return p?.kegiatans || p?.kegiatans || [];
  }, [rkaForm.program_id, renstraPrograms]);

  const subkegiatanOptions = useMemo(() => {
    if (!rkaForm.kegiatan_id) return [];
    const k = kegiatanOptions.find((x) => Number(x.id) === Number(rkaForm.kegiatan_id));
    return k?.subkegiatans || [];
  }, [rkaForm.kegiatan_id, kegiatanOptions]);

  async function handleSubmitRka(e) {
    e?.preventDefault?.();
    if (!rkaForm.program_id || !rkaForm.kegiatan_id || !rkaForm.subkegiatan_id) {
      return alert("Program, Kegiatan, Sub Kegiatan wajib dipilih.");
    }
    try {
      const payload = { year, ...rkaForm };
      const res = await axiosInstance.post("/rka", payload);
      const saved = res.data;
      console.log("RKA created:", saved);

      // build detail from renstra lists (to show in belanja step)
      const prog = renstraPrograms.find((p) => Number(p.id) === Number(rkaForm.program_id));
      const keg = (prog?.kegiatans || []).find((k) => Number(k.id) === Number(rkaForm.kegiatan_id));
      const sub = (keg?.subkegiatans || []).find((s) => Number(s.id) === Number(rkaForm.subkegiatan_id));

      setCurrentRkaDetail({
        id: saved?.id ?? saved?.insertId ?? null,
        program: prog,
        kegiatan: keg,
        subkegiatan: sub,
        penanggungjawab: pegawaiList.find((p) => Number(p.id) === Number(rkaForm.penanggungjawab_id)) || null,
        pelaksana: pegawaiList.find((p) => Number(p.id) === Number(rkaForm.pelaksana_id)) || null,
        tanggal_mulai: rkaForm.tanggal_mulai,
        tanggal_selesai: rkaForm.tanggal_selesai,
      });

      setShowInputModal(false);
      setShowBelanjaStep(true);
      fetchRkaTable();
    } catch (err) {
      console.error("handleSubmitRka failed", err);
      alert("Gagal menyimpan RKA. Cek console/network.");
    }
  }

async function handleSaveBelanja(items) {
  if (!currentRkaDetail?.id) return alert("RKA belum tersimpan id-nya.");
  try {
    await axiosInstance.post(`/rka/${currentRkaDetail.id}/belanja`, { items });
    alert("Belanja tersimpan.");
    setShowBelanjaStep(false);
    setCurrentRkaDetail(null);
    fetchRkaTable(); // reload table (important)
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan belanja");
  }
}


  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">RENCANA KERJA ANGGARAN (RKA)</h1>
        <div className="text-lg">DINKOPUKM KARAWANG</div>
        <div className="text-xl font-semibold mt-1">TAHUN {year}</div>
      </header>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <span>Pilih Tahun</span>
            <select
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setYear(y);
                fetchRkaTable(y);
              }}
              className="border rounded px-2 py-1"
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>

          <button onClick={() => setShowInputModal(true)} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded">INPUT RKA</button>
        </div>

        <div className="flex gap-2">
          {["KAK","Cascading","Perjanjian Kinerja","Rencana Aksi","Pohon Kinerja","Manajemen Resiko"].map(t => (
            <button key={t} className="px-3 py-1 border rounded bg-gray-100 text-gray-500" disabled>{t}</button>
          ))}
        </div>
      </div>

      {!showBelanjaStep && (
        <>
          <div className="border rounded p-4 mb-4">
            <div className="font-semibold">📌 Rencana Kerja Anggaran Tahun {year}</div>
            <div className="text-sm text-gray-500">Data master: {loadingMasters ? "memuat..." : "siap"}</div>
          </div>

          <RkaTable data={rkaTableData} onEdit={() => setShowInputModal(true)} />
        </>
      )}

      {showBelanjaStep && currentRkaDetail && (
        <BelanjaSection currentRkaDetail={currentRkaDetail} rkaForm={rkaForm} onSave={handleSaveBelanja} onCancel={() => setShowBelanjaStep(false)} />
      )}

      {showInputModal && (
        <InputRKA
          renstraPrograms={renstraPrograms}
          kegiatanOptions={kegiatanOptions}
          subkegiatanOptions={subkegiatanOptions}
          pegawaiList={pegawaiList}
          satuanList={satuanList}
          rkaForm={rkaForm}
          onChangeForm={onChangeForm}
          onClose={() => setShowInputModal(false)}
          onSubmit={handleSubmitRka}
        />
      )}
    </div>
  );
}
