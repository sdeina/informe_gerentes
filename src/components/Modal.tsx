"use client";

import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="neo-card w-full max-w-sm bg-white p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>
        
        <p className="text-gray-600 font-bold text-sm leading-relaxed mb-8">
          {message}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="p-3 font-black uppercase text-xs border-[3px] border-black rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="p-3 font-black uppercase text-xs border-[3px] border-black rounded-xl bg-[#0047b3] text-white shadow-[4px记录4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
