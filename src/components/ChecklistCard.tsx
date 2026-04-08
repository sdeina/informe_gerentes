"use client";

import { Check, ChevronRight } from "lucide-react";
import React from "react";

interface Item {
  key: string;
  text: string;
}

interface ChecklistCardProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  items: Item[];
  checkedItems: Record<string, boolean>;
  onToggle: (key: string) => void;
  onSelectAll: (sectionId: string) => void;
  observationValue: string;
  onObservationChange: (sectionId: string, value: string) => void;
}

export default function ChecklistCard({
  id,
  label,
  icon,
  iconBg,
  items,
  checkedItems,
  onToggle,
  onSelectAll,
  observationValue,
  onObservationChange,
}: ChecklistCardProps) {
  const completedCount = items.filter((item) => checkedItems[item.key]).length;
  const isAllDone = completedCount === items.length;

  return (
    <div className="neo-card mb-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-[3px] border-black bg-white">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border-2 border-black flex items-center justify-center`} style={{ backgroundColor: iconBg }}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-none uppercase">{label}</h2>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase">
              {completedCount} / {items.length} COMPLETADOS
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelectAll(id)}
          className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg border-2 border-black transition-colors ${
            isAllDone ? "bg-gray-100 text-gray-400" : "bg-[#0047b3] text-white shadow-[2px_2px_0px_0px_#000]"
          }`}
        >
          {isAllDone ? "Deseleccionar" : "Todo"}
        </button>
      </div>

      {/* Items */}
      <div className="divide-y-[2px] divide-gray-100">
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() => onToggle(item.key)}
            className={`flex items-start gap-4 p-4 cursor-pointer transition-colors active:bg-gray-50 select-none ${
              checkedItems[item.key] ? "bg-blue-50/30" : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`mt-0.5 w-6 h-6 rounded-md border-2 border-black flex items-center justify-center shrink-0 transition-all ${
                checkedItems[item.key] ? "bg-[#0047b3] border-[#0047b3]" : "bg-white"
              }`}
            >
              {checkedItems[item.key] && <Check size={14} strokeWidth={4} color="white" />}
            </div>
            <span className={`text-[15px] leading-tight font-semibold ${
              checkedItems[item.key] ? "text-gray-400 line-through decoration-2" : "text-black"
            }`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Section Observations */}
      <div className="p-4 bg-gray-50 border-t-[2px] border-black">
        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
          ¿Observaciones en {label.split(".")[1]?.trim() || label}?
        </label>
        <textarea
          value={observationValue}
          onChange={(e) => onObservationChange(id, e.target.value)}
          placeholder="Comentá novedades específicas de este sector..."
          className="neo-input w-full min-h-[80px] text-sm resize-none bg-white p-3"
        />
      </div>
    </div>
  );
}
