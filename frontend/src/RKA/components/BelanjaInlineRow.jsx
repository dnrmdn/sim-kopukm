import React from "react";

export default function BelanjaInlineRow({ item, onChange }) {

  function update(key, val) {
    onChange({
      ...item,
      [key]: Number(val)
    });
  }

  return (

    <tr className="bg-slate-50/40">

      <td className="pl-24 text-xs py-2">
        • {item.belanja}
      </td>

      <td className="text-right font-mono">
        {fmtIdr(item.murni)}
      </td>

      <td>
        <input
          type="number"
          value={item.pergeseran_i}
          onChange={e => update("pergeseran_i", e.target.value)}
          className="w-20 border rounded text-xs px-1"
        />
      </td>

      <td>
        <input
          type="number"
          value={item.pergeseran_ii}
          onChange={e => update("pergeseran_ii", e.target.value)}
          className="w-20 border rounded text-xs px-1"
        />
      </td>

      <td>
        <input
          type="number"
          value={item.efisiensi}
          onChange={e => update("efisiensi", e.target.value)}
          className="w-20 border rounded text-xs px-1"
        />
      </td>

      <td>
        <input
          type="number"
          value={item.perubahan}
          onChange={e => update("perubahan", e.target.value)}
          className="w-20 border rounded text-xs px-1"
        />
      </td>

      <td>
        <input
          type="number"
          value={item.realisasi}
          onChange={e => update("realisasi", e.target.value)}
          className="w-20 border rounded text-xs px-1"
        />
      </td>

      <td></td>

    </tr>

  );

}