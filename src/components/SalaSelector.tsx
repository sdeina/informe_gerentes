"use client";

import { Building2 } from "lucide-react";

interface SalaSelectorProps {
  onSelect: (sala: "PASTEKO" | "STEPAKO") => void;
}

export default function SalaSelector({ onSelect }: SalaSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#f8f9fa]">
      <div className="mb-8 animate-bounce">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain mx-auto" />
      </div>
      
      <div className="neo-card w-full max-w-md p-8 text-center bg-white">
        <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">
          INFORME GERENTES
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          Seleccioná la sala para comenzar el reporte
        </p>
        
        <div className="grid gap-6">
          <button 
            onClick={() => onSelect("PASTEKO")}
            className="neo-btn flex-col py-8 group"
          >
            <div className="bg-white/20 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Building2 size={32} />
            </div>
            <span className="text-xl">PASTEKO</span>
          </button>
          
          <button 
            onClick={() => onSelect("STEPAKO")}
            className="neo-btn bg-[#ffb703] text-black flex-col py-8 group"
          >
            <div className="bg-black/10 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Building2 size={32} />
            </div>
            <span className="text-xl">STEPAKO</span>
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-500 font-bold uppercase tracking-widest">
        Sistema de Registro Gerencial v2.0
      </p>
    </div>
  );
}
