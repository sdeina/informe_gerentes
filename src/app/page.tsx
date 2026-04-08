"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Shield, 
  Trophy, 
  Star, 
  Users, 
  BarChart3, 
  User, 
  Calendar,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react";
import SalaSelector from "@/components/SalaSelector";
import ChecklistCard from "@/components/ChecklistCard";
import Modal from "@/components/Modal";

const SECTIONS = [
  {
    id: "apertura", label: "1. APERTURA / INICIO DE TURNO",
    icon: <Zap size={20} />, iconBg: "#e8f5e9",
    items: [
      { key: "ap1", text: "Verificar dotación completa de personal" },
      { key: "ap2", text: "Confirmar puestos críticos cubiertos (caja, slots, seguridad, técnica, gastronomía)" },
      { key: "ap3", text: "Revisar ausencias, llegadas tarde." },
      { key: "ap4", text: "Confirmar apertura operativa de todos los sectores." },
      { key: "ap5", text: "Verificar presentación general de sala." },
      { key: "ap6", text: "Controlar limpieza general, baños y áreas comunes." },
      { key: "ap7", text: "Revisar climatización, iluminación, música ambiente y aroma" },
      { key: "ap8", text: "Confirmar funcionamiento de accesos y puertas de emergencia" }
    ]
  },
  {
    id: "seguridad", label: "2. SEGURIDAD Y CONTROL",
    icon: <Shield size={20} />, iconBg: "#fff3e0",
    items: [
      { key: "seg1", text: "Confirmar presencia de personal de seguridad" },
      { key: "seg2", text: "Verificar funcionamiento de CCTV" },
      { key: "seg3", text: "Revisar cobertura de cámaras en sectores sensibles" },
      { key: "seg4", text: "Confirmar estado de matafuegos y salidas de emergencia visibles" },
      { key: "seg5", text: "Confirmar que no haya situaciones sospechosas en sala" },
      { key: "seg6", text: "Revisar libro de novedades de seguridad" }
    ]
  },
  {
    id: "slots", label: "3. SLOTS / JUEGO",
    icon: <Trophy size={20} />, iconBg: "#fce4ec",
    items: [
      { key: "sl1", text: "Verificar porcentaje de máquinas operativas" },
      { key: "sl2", text: "Revisar máquinas fuera de servicio y tiempo estimado de reparación" },
      { key: "sl3", text: "Controlar orden y limpieza en parque de máquinas" },
      { key: "sl4", text: "Verificar correcto funcionamiento de sistemas de tickets / cashless" },
      { key: "sl5", text: "Revisar ocupación de sala y sectores calientes/fríos" },
      { key: "sl6", text: "Confirmar que jackpots / progresivos / cartelería funcionen bien" },
      { key: "sl7", text: "Verificar personal de sala visible y atento al cliente" },
      { key: "sl8", text: "Revisar incidencias técnicas del turno" },
      { key: "sl9", text: "Confirmar stock de insumos cajas de tito" }
    ]
  },
  {
    id: "experiencia", label: "4. EXPERIENCIA DEL CLIENTE",
    icon: <Star size={20} />, iconBg: "#ede7f6",
    items: [
      { key: "exp1",  text: "Recorrer sala y saludar clientes frecuentes / VIP" },
      { key: "exp2",  text: "Controlar tiempos de atención al cliente" },
      { key: "exp3",  text: "Verificar calidad de atención del personal" },
      { key: "exp4",  text: "Revisar limpieza y orden en sectores de alto tránsito" },
      { key: "exp5",  text: "Confirmar servicio correcto en gastronomía / bar / café" },
      { key: "exp6",  text: "Verificar promociones, sorteos o activaciones del día" },
      { key: "exp7",  text: "Revisar cartelería, pantallas y comunicación vigente" },
      { key: "exp8",  text: "Confirmar resolución de quejas o reclamos abiertos" },
      { key: "exp9",  text: "Detectar oportunidades comerciales en sala" },
      { key: "exp10", text: "Monitorear el frente del complejo, iluminación y limpieza" }
    ]
  },
  {
    id: "personal", label: "5. PERSONAL Y LIDERAZGO",
    icon: <Users size={20} />, iconBg: "#e3f2fd",
    items: [
      { key: "per1", text: "Observar desempeño de jefes" },
      { key: "per2", text: "Detectar necesidad de apoyo o redistribución de personal" },
      { key: "per3", text: "Corregir desvíos operativos en el momento" },
      { key: "per4", text: "Reconocer buenas prácticas del equipo y vestimenta" },
      { key: "per5", text: "Registrar faltas, incumplimientos o puntos de mejora" }
    ]
  },
  {
    id: "comercial", label: "6. SEGUIMIENTO COMERCIAL",
    icon: <BarChart3 size={20} />, iconBg: "#e8f5e9",
    items: [
      { key: "com1", text: "Revisar nivel de ocupación de sala" },
      { key: "com2", text: "Identificar franjas horarias de mayor tráfico" },
      { key: "com3", text: "Verificar rendimiento de promociones activas" },
      { key: "com4", text: "Controlar presencia de clientes frecuentes / VIP / nuevos" },
      { key: "com5", text: "Detectar oportunidades de fidelización" },
      { key: "com6", text: "Registrar comentarios del cliente útiles para futuras acciones" },
      { key: "com7", text: "Monitorear competencia / eventos externos si impactan en la sala" }
    ]
  }
];

const TOTAL_ITEMS = 45;

export default function Home() {
  const [sala, setSala] = useState<"PASTEKO" | "STEPAKO" | null>(null);
  const [gerente, setGerente] = useState("");
  const [fecha, setFecha] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [sectionObservations, setSectionObservations] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    setFecha(new Date().toISOString().split("T")[0]);
  }, []);

  const handleToggle = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSectionObservationChange = (sectionId: string, value: string) => {
    setSectionObservations(prev => ({ ...prev, [sectionId]: value }));
  };

  const handleSelectAll = (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return;

    const allChecked = section.items.every(item => checks[item.key]);
    const newState = { ...checks };
    section.items.forEach(item => {
      newState[item.key] = !allChecked;
    });
    setChecks(newState);
  };

  const handleBack = () => {
    const hasData = gerente || observaciones || completedCount > 0;
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
    setChecks({});
    setSectionObservations({});
    setObservaciones("");
    setStatus(null);
  };

  const completedCount = Object.values(checks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / TOTAL_ITEMS) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gerente || !fecha) {
      alert("Por favor completá el nombre del gerente y la fecha.");
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
          checks,
          sectionObservations,
          observaciones
        })
      });

      const result = await response.json();
      if (result.ok) {
        setStatus({ type: "success", message: `¡Checklist enviado con éxito!` });
        
        // Wait 2 seconds to show the success message, then go home and reset
        setTimeout(() => {
          setSala(null);
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || "Error al enviar");
      }
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!sala) {
    return (
      <>
        <SalaSelector onSelect={setSala} />
        {/* Persistent Footer or similar can go here */}
      </>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Exit Confirmation Modal */}
      <Modal 
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={confirmExit}
        title="¿Salir ahora?"
        message="Tenés cambios sin enviar. Si salís, se perderá el progreso actual del reporte."
      />
      {/* Top Progress Bar */}
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
              {completedCount} / {TOTAL_ITEMS}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-20">
        <header className="mb-10 text-center">
          <div className="inline-block p-4 neo-card bg-[#ffb703] mb-6">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">INFORME GERENTES</h1>
          <p className="text-gray-500 font-bold uppercase text-sm tracking-widest leading-none">
            Completá todos los sectores para finalizar
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info Card */}
          <div className="neo-card p-6 bg-white space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg border-2 border-black">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black uppercase">Información General</h2>
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

          {/* Checklist Sections */}
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <ChecklistCard
                key={section.id}
                {...section}
                checkedItems={checks}
                onToggle={handleToggle}
                onSelectAll={handleSelectAll}
                observationValue={sectionObservations[section.id] || ""}
                onObservationChange={handleSectionObservationChange}
              />
            ))}
          </div>

          {/* Observations */}
          <div className="neo-card p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#fff8ec] rounded-lg border-2 border-black text-[#ffb703]">
                <MessageSquare size={20} color="black" fill="#ffb703" />
              </div>
              <h2 className="text-xl font-black uppercase">Observaciones</h2>
            </div>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Escribí aquí novedades, incidentes o comentarios relevantes del turno..."
              className="neo-input w-full min-h-[150px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-6 left-0 right-0 z-40">
            {status && (
              <div className={`neo-card p-4 mb-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 bg-white`}>
                <div className="w-10 h-10 shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className={`font-black uppercase text-xs ${status.type === "success" ? "text-green-700" : "text-red-700"}`}>
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

            {completedCount === TOTAL_ITEMS ? (
              <button
                type="submit"
                disabled={submitting}
                className="neo-btn w-full py-5 text-xl relative group bg-[#0047b3]"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>ENVIAR REPORTE {sala}</span>
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            ) : (
              <div className="neo-card bg-gray-100 p-4 text-center border-dashed border-gray-300">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Faltan {TOTAL_ITEMS - completedCount} ítems para habilitar envío
                </p>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
