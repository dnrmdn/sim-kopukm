import React, { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const buildTree = (dataset) => {
  const hashTable = Object.create(null);
  dataset.forEach(a => hashTable[a.id] = { ...a, children: [] });
  const dataTree = [];
  dataset.forEach(a => {
    if (a.parent_id) {
      if (hashTable[a.parent_id]) hashTable[a.parent_id].children.push(hashTable[a.id]);
    } else {
      dataTree.push(hashTable[a.id]);
    }
  });
  return dataTree;
};

/* ================= RENDER ITEM ================= */
function HirarkiItem({ item, level = 0 }) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = item.children && item.children.length > 0;
  const isIndikator = item.level === "indikator";

  return (
    <div className={`flex flex-col ${level > 0 ? "ml-5 border-l border-slate-200" : ""}`}>
      <div 
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`
          flex items-start gap-4 py-3 px-3 rounded-lg transition-all
          ${level === 0 ? "bg-slate-50 mb-3 border border-slate-200 shadow-sm" : "hover:bg-slate-50/80"}
          ${hasChildren ? "cursor-pointer" : "cursor-default"}
        `}
      >
        {/* Toggle Arrow */}
        <div className="mt-1.5 w-5 h-5 flex items-center justify-center shrink-0">
          {hasChildren ? (
            isOpen ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-400" />
          ) : isIndikator ? (
            <div className="w-2 h-2 rounded-full bg-blue-500/60 ml-1" />
          ) : null}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200 px-2 py-0.5 rounded shadow-sm">
              {item.level}
            </span>
           
          </div>
          <p className={`
            text-[14px] leading-relaxed tracking-normal
            ${level === 0 ? "font-bold text-slate-900" : "text-slate-700 font-medium"}
            ${isIndikator ? "text-slate-500 italic" : ""}
          `}>
            {item.uraian}
          </p>
        </div>
      </div>

      {/* Render Anak */}
      {isOpen && hasChildren && (
        <div className="mb-4">
          {item.children.map((child) => (
            <HirarkiItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function HirarkiComponents({ data = [] }) {
  const treeData = useMemo(() => buildTree(data), [data]);

  if (!data.length) return <div className="text-center text-xs text-slate-400 py-20 font-medium uppercase tracking-widest">Belum ada data cascading.</div>;

  return (
    <div className="w-full  max-w-5xl">
      <div className="mb-2">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Hierarki RPJMD</h2>
      </div>

      <div className="space-y-2">
        {treeData.map((rootItem) => (
          <HirarkiItem key={rootItem.id} item={rootItem} />
        ))}
      </div>
    </div>
  );
}