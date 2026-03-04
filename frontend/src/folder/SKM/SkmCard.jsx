export default function SkmCard({ data }) {
  if (!data) return null;

  const nilai = Number(data.nilai || 0);

  function kategori(nilai) {
    if (nilai >= 88) return "Sangat Baik";
    if (nilai >= 76) return "Baik";
    if (nilai >= 65) return "Cukup";
    return "Kurang";
  }

  function warna(kat) {
    return {
      "Sangat Baik": "bg-blue-600",
      "Baik": "bg-green-600",
      "Cukup": "bg-yellow-500",
      "Kurang": "bg-red-600",
    }[kat];
  }

  const kat = kategori(nilai);
  const barColor = warna(kat);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium text-slate-800">
          {data.nama_layanan}
        </h2>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500">NILAI</p>
          <p className="text-2xl font-semibold text-slate-800">
            {nilai}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">KATEGORI</p>
          <span
            className={`inline-block mt-1 rounded px-3 py-1 text-xs text-white ${barColor}`}
          >
            {kat}
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-500">PROGRES</p>
          <div className="mt-2 h-2 w-full rounded bg-slate-200">
            <div
              className={`h-2 rounded ${barColor}`}
              style={{ width: `${nilai}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}