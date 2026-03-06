import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function SerapanGauge({ anggaran, realisasi }) {

  const percent = anggaran
    ? ((realisasi / anggaran) * 100).toFixed(1)
    : 0;

  return (

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">

      <h3 className="font-bold mb-4 text-slate-700">
        Serapan Anggaran
      </h3>

      <div className="w-40 mx-auto">

        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
        />

      </div>

    </div>

  );
}