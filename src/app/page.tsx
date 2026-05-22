"use client";

import { useState, useEffect, useMemo } from "react";
import {
  User,
  Calendar,
  Send,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import SalaSelector from "@/components/SalaSelector";
import RecorridaForm from "@/components/RecorridaForm";
import Modal from "@/components/Modal";
import {
  type FormData,
  countCompleted,
  totalRequired,
  isFormComplete,
} from "@/lib/recorrida-schema";

export default function Home() {
  const [sala, setSala] = useState<"PASTEKO" | "STEPAKO" | null>(null);
  const [gerente, setGerente] = useState("");
  const [fecha, setFecha] = useState("");
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    setFecha(new Date().toISOString().split("T")[0]);
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const completedCount = useMemo(() => countCompleted(formData), [formData]);
  const totalFields = useMemo(() => totalRequired(formData), [formData]);
  const progressPercent = Math.round((completedCount / totalFields) * 100);
  const canSubmit = isFormComplete(formData) && !!gerente && !!fecha;

  const hasData =
    !!gerente ||
    completedCount > 0 ||
    Object.values(formData).some((v) => v.trim().length > 0);

  const handleBack = () => {
    if (hasData) {
      setShowExitModal(true);
    } else {
      setSala(null);
    }
  };

  const confirmExit = () => {
    setSala(null);
    resetForm();
    setShowExitModal(false);
  };

  const resetForm = () => {
    setGerente("");
    setFormData({});
    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gerente || !fecha) {
      alert("Por favor completá el nombre del gerente y la fecha.");
      return;
    }
    if (!canSubmit) {
      alert("Completá todos los campos obligatorios (*) antes de enviar.");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sala,
          gerente,
          fecha,
          formData,
        }),
      });

      const result = await response.json();
      if (result.ok) {
        setStatus({ type: "success", message: "¡Formulario enviado con éxito!" });
        setTimeout(() => {
          setSala(null);
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || "Error al enviar");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al enviar";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!sala) {
    return <SalaSelector onSelect={setSala} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={confirmExit}
        title="¿Salir ahora?"
        message="Tenés cambios sin enviar. Si salís, se perderá el progreso actual del reporte."
      />

      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-[3px] border-black">
        <div className="h-2 bg-[#e8f5e9]">
          <div
            className="h-full bg-[#0047b3] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-xs font-black uppercase hover:text-[#0047b3] transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="pill text-[10px] py-1 px-3 shadow-none border-2">{sala}</span>
            <span className="text-[10px] font-black uppercase text-gray-400">
              {completedCount} / {totalFields}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-20">
        <header className="mb-10 text-center">
          <div className="inline-block p-4 neo-card bg-[#ffb703] mb-6">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2 uppercase leading-tight">
            Informe de guardia
          </h1>
          <p className="text-[#0047b3] font-black uppercase text-xs tracking-widest">Gerencia</p>
          <p className="text-gray-500 font-bold uppercase text-sm tracking-widest leading-none mt-3">
            Completá todas las secciones para finalizar
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="neo-card p-6 bg-white space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg border-2 border-black">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black uppercase">Datos del Turno</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Gerente de Guardia</label>
                <div className="relative">
                  <input
                    type="text"
                    value={gerente}
                    onChange={(e) => setGerente(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="neo-input w-full !pl-14 neo-input-with-icon"
                    required
                  />
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Fecha del Reporte</label>
                <div className="relative">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="neo-input w-full !pl-14 pr-4"
                    required
                  />
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          <RecorridaForm data={formData} onChange={handleFieldChange} />

          <div className="sticky bottom-6 left-0 right-0 z-40">
            {status && (
              <div className="neo-card p-4 mb-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 bg-white">
                <div className="w-10 h-10 shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-black uppercase text-xs ${
                      status.type === "success" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {status.message}
                  </p>
                </div>
                {status.type === "success" && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="ml-auto text-xs font-black underline"
                  >
                    NUEVO
                  </button>
                )}
              </div>
            )}

            {canSubmit ? (
              <button
                type="submit"
                disabled={submitting}
                className="neo-btn w-full py-5 text-xl relative group bg-[#0047b3]"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>ENVIAR INFORME {sala}</span>
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            ) : (
              <div className="neo-card bg-gray-100 p-4 text-center border-dashed border-gray-300">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Faltan {totalFields - completedCount} campos obligatorios para habilitar envío
                </p>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
