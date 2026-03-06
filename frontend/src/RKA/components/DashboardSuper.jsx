import React, { useMemo } from "react";
import SummaryCards from "./SummaryCards";
import SerapanGauge from "./SerapanGauge";
import RealisasiChart from "./RealisasiChart";
import RankingProgram from "./RankingProgram";
import HeatmapKegiatan from "./HeatmapKegiatan";
import RealisasiBulanan from "./RealisasiBulanan"
import TimelineKegiatan from "./TimelineKegiatan"
import AlertSerapan from "./AlertSerapan"

export default function DashboardSuper({ data = [] }) {

  const totals = useMemo(() => {
    let anggaran = 0;
    let realisasi = 0;

    // Pastikan data adalah array sebelum looping
    if (!Array.isArray(data)) return { anggaran: 0, realisasi: 0 };

    data.forEach(p => {
      // Gunakan ?. dan || [] untuk menjaga jika kegiatans tidak ada
      (p?.kegiatans || []).forEach(k => {
        (k?.subs || []).forEach(s => {
          // Cek rka dan rincian belanja
          (s?.rka?.belanja || []).forEach(b => {
            anggaran += Number(b.murni || 0);
            realisasi += Number(b.realisasi || 0);
          });
        });
      });
    });

    return { anggaran, realisasi };
  }, [data]);

  return (
    <div id="dashboard" className="space-y-6">
      <AlertSerapan data={data} />

      <SummaryCards
        anggaran={totals.anggaran}
        realisasi={totals.realisasi}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SerapanGauge
          anggaran={totals.anggaran}
          realisasi={totals.realisasi}
        />
        <RankingProgram data={data} />
        <HeatmapKegiatan data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealisasiChart data={data} />
        <RealisasiBulanan data={data} />
      </div>

      <TimelineKegiatan data={data} />
    </div>
  );
}