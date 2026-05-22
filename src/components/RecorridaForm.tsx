"use client";

import {
  Zap,
  Sparkles,
  Shield,
  HeartHandshake,
  Star,
  Users,
  ClipboardCheck,
} from "lucide-react";
import FormSection, { FieldBlock, TextAreaField } from "@/components/form/FormSection";
import ConditionalComment from "@/components/form/ConditionalComment";
import RadioField, {
  YES_NO,
  SCALE_3,
  OCUPACION,
  CLIMA_VIP,
  LIBRO_NOVEDADES,
} from "@/components/form/RadioField";
import {
  isScaleNeedsComment,
  isVipNeedsComment,
  type FormData,
} from "@/lib/recorrida-schema";

interface RecorridaFormProps {
  data: FormData;
  onChange: (key: string, value: string) => void;
}

export default function RecorridaForm({ data, onChange }: RecorridaFormProps) {
  const set = (key: string) => (value: string) => onChange(key, value);

  return (
    <div className="space-y-2">
      <FormSection
        number="0"
        title="Registro de Personal Operativo del Turno"
        subtitle="Completar al inicio de la guardia para saber con qué equipo se cuenta."
        icon={<Users size={20} />}
        iconBg="#e3f2fd"
      >
        <FieldBlock label="Dotación Planificada vs. Real" required>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase text-gray-500">Planificados</span>
            <input
              type="number"
              min={0}
              value={data.dotacionPlanificados || ""}
              onChange={(e) => set("dotacionPlanificados")(e.target.value)}
              className="neo-input w-24 text-center"
              required
            />
            <span className="text-xs font-black uppercase text-gray-500">Presentes</span>
            <input
              type="number"
              min={0}
              value={data.dotacionPresentes || ""}
              onChange={(e) => set("dotacionPresentes")(e.target.value)}
              className="neo-input w-24 text-center"
              required
            />
          </div>
        </FieldBlock>
        <FieldBlock
          label="Ausencias / Llegadas tarde detectadas"
          required
          hint="Detallar nombres y si se requirió cubrir el puesto"
        >
          <TextAreaField
            value={data.ausenciasLlegadasTarde || ""}
            onChange={set("ausenciasLlegadasTarde")}
            placeholder="Detallar nombres y coberturas..."
            required
          />
        </FieldBlock>
      </FormSection>

      <FormSection
        number="1"
        title="Apertura Operativa y Personal"
        icon={<Zap size={20} />}
        iconBg="#e8f5e9"
      >
        <FieldBlock
          label="1.1 Puestos críticos cubiertos (Caja, slots, seguridad, técnica, gastronomía, limpieza)"
          required
        >
          <RadioField name="puestosCriticos" value={data.puestosCriticos || ""} onChange={set("puestosCriticos")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.puestosCriticos === "no"}
          hint="Ej: Si Ruleta está sin personal, indicar cómo se custodia"
          value={data.puestosCriticosComentarios || ""}
          onChange={set("puestosCriticosComentarios")}
          required
        />

        <FieldBlock label="1.2 Presencia de personal en sala con vestimenta reglamentaria" required>
          <RadioField name="presenciaPersonal" value={data.presenciaPersonal || ""} onChange={set("presenciaPersonal")} options={SCALE_3} required />
        </FieldBlock>
        <ConditionalComment
          show={isScaleNeedsComment(data.presenciaPersonal)}
          label="Comentarios / Desvíos corregidos en el momento"
          value={data.presenciaPersonalComentarios || ""}
          onChange={set("presenciaPersonalComentarios")}
          required
        />
      </FormSection>

      <FormSection
        number="2"
        title="Infraestructura, Limpieza y Confort"
        subtitle="Visual y Ambiental"
        icon={<Sparkles size={20} />}
        iconBg="#fff8e1"
      >
        <FieldBlock label="2.1 Higiene General (Islas, pisos, accesos, fachada y baños OK)" required>
          <RadioField name="higieneGeneral" value={data.higieneGeneral || ""} onChange={set("higieneGeneral")} options={SCALE_3} required />
        </FieldBlock>
        <ConditionalComment
          show={isScaleNeedsComment(data.higieneGeneral)}
          label="Detalle de sectores a reforzar"
          value={data.higieneSectoresReforzar || ""}
          onChange={set("higieneSectoresReforzar")}
          placeholder="Sectores a reforzar..."
          required
        />

        <FieldBlock
          label="2.2 ¿La sala se encuentra en condiciones adecuadas? (Climatización, iluminación, música y aroma)"
          required
        >
          <RadioField name="confortAmbiental" value={data.confortAmbiental || ""} onChange={set("confortAmbiental")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.confortAmbiental === "no"}
          label="¿Por qué?"
          value={data.confortAmbientalComentarios || ""}
          onChange={set("confortAmbientalComentarios")}
          placeholder="Explicá qué condición no se cumple..."
          required
        />

        <FieldBlock label="2.3 Cartelería, pantallas comerciales y promociones activas" required>
          <RadioField name="carteleriaPromos" value={data.carteleriaPromos || ""} onChange={set("carteleriaPromos")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.carteleriaPromos === "no"}
          value={data.carteleriaComentarios || ""}
          onChange={set("carteleriaComentarios")}
          required
        />
      </FormSection>

      <FormSection
        number="3"
        title="Seguridad y Prevención de Riesgos"
        icon={<Shield size={20} />}
        iconBg="#fff3e0"
      >
        <FieldBlock label="3.1 ¿Hay presencia de Policía?" required>
          <RadioField name="presenciaPolicia" value={data.presenciaPolicia || ""} onChange={set("presenciaPolicia")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.presenciaPolicia === "no"}
          value={data.presenciaPoliciaComentarios || ""}
          onChange={set("presenciaPoliciaComentarios")}
          required
        />

        <FieldBlock label="3.2 Revisión del Libro de Novedades de Seguridad" required>
          <RadioField name="libroNovedades" value={data.libroNovedades || ""} onChange={set("libroNovedades")} options={LIBRO_NOVEDADES} required />
        </FieldBlock>
        <ConditionalComment
          show={data.libroNovedades === "no"}
          label="Novedades relevantes"
          value={data.libroNovedadesDetalle || ""}
          onChange={set("libroNovedadesDetalle")}
          placeholder="Detallar incidentes, ingresos prohibidos, etc."
          required
        />

        <FieldBlock label="3.3 Cobertura y funcionamiento de CCTV (Validado con Búnker)" required>
          <RadioField name="cctv" value={data.cctv || ""} onChange={set("cctv")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.cctv === "no"}
          value={data.cctvComentarios || ""}
          onChange={set("cctvComentarios")}
          required
        />

        <FieldBlock label="3.4 Puertas de emergencia despejadas" required>
          <RadioField name="puertasEmergencia" value={data.puertasEmergencia || ""} onChange={set("puertasEmergencia")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.puertasEmergencia === "no"}
          value={data.puertasEmergenciaComentarios || ""}
          onChange={set("puertasEmergenciaComentarios")}
          required
        />
      </FormSection>

      <FormSection
        number="4"
        title="Fidelización de Clientes"
        icon={<HeartHandshake size={20} />}
        iconBg="#fce4ec"
      >
        <FieldBlock label="4.1 ¿Cuántos clientes fidelizaron en el turno?" required>
          <input
            type="number"
            min={0}
            value={data.fidelizacionCantidad || ""}
            onChange={(e) => set("fidelizacionCantidad")(e.target.value)}
            className="neo-input w-32 text-center"
            required
          />
        </FieldBlock>

        <FieldBlock label="4.2 ¿Tuvieron algún inconveniente?" required>
          <RadioField name="fidelizacionInconveniente" value={data.fidelizacionInconveniente || ""} onChange={set("fidelizacionInconveniente")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.fidelizacionInconveniente === "si"}
          label="Detalle del inconveniente"
          value={data.fidelizacionInconvenienteComentarios || ""}
          onChange={set("fidelizacionInconvenienteComentarios")}
          required
        />

        <FieldBlock label="4.3 ¿El sistema y la PC de fidelización funcionan correctamente?" required>
          <RadioField name="fidelizacionSistemaOk" value={data.fidelizacionSistemaOk || ""} onChange={set("fidelizacionSistemaOk")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.fidelizacionSistemaOk === "no"}
          label="Detalle del problema"
          value={data.fidelizacionSistemaComentarios || ""}
          onChange={set("fidelizacionSistemaComentarios")}
          required
        />

        <FieldBlock label="4.4 ¿Hubo alguna queja de un cliente referida a la fidelización?" required>
          <RadioField name="fidelizacionQuejaCliente" value={data.fidelizacionQuejaCliente || ""} onChange={set("fidelizacionQuejaCliente")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.fidelizacionQuejaCliente === "si"}
          label="Detalle de la queja"
          value={data.fidelizacionQuejaComentarios || ""}
          onChange={set("fidelizacionQuejaComentarios")}
          required
        />
      </FormSection>

      <FormSection
        number="5"
        title="Experiencia del Cliente y Actividad Comercial"
        icon={<Star size={20} />}
        iconBg="#ede7f6"
      >
        <FieldBlock label="5.1 Termómetro de Ocupación en Sala (horas pico)" required>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase w-14">22:00</span>
              <RadioField name="ocupacion2200" value={data.ocupacion2200 || ""} onChange={set("ocupacion2200")} options={OCUPACION} required />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase w-14">02:00</span>
              <RadioField name="ocupacion0200" value={data.ocupacion0200 || ""} onChange={set("ocupacion0200")} options={OCUPACION} required />
            </div>
          </div>
        </FieldBlock>

        <FieldBlock label="5.2 Interacción con Clientes VIP / Frecuentes" required>
          <p className="text-xs text-gray-500 font-medium mb-1">Escala de Clima en Sala</p>
          <RadioField name="climaVip" value={data.climaVip || ""} onChange={set("climaVip")} options={CLIMA_VIP} required />
        </FieldBlock>
        <ConditionalComment
          show={isVipNeedsComment(data.climaVip)}
          label="Comentarios, sugerencias o reclamos abiertos del cliente"
          value={data.vipComentarios || ""}
          onChange={set("vipComentarios")}
          required
        />

        <FieldBlock label="5.3 Cumplimiento de Promociones (Sorteos / canje de puntos)" required>
          <RadioField name="promociones" value={data.promociones || ""} onChange={set("promociones")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.promociones === "no"}
          value={data.promocionesComentarios || ""}
          onChange={set("promocionesComentarios")}
          required
        />

        <FieldBlock label="5.4 ¿Considerás que la atención al cliente fue rápida durante tu turno?" required>
          <RadioField name="atencionRapida" value={data.atencionRapida || ""} onChange={set("atencionRapida")} options={YES_NO} required />
        </FieldBlock>
        <ConditionalComment
          show={data.atencionRapida === "no"}
          label="¿Por qué?"
          value={data.atencionRapidaComentarios || ""}
          onChange={set("atencionRapidaComentarios")}
          placeholder="Explicá las demoras o situaciones..."
          required
        />
      </FormSection>

      <FormSection
        number="6"
        title="Cierre de Turno"
        icon={<ClipboardCheck size={20} />}
        iconBg="#e8eaf6"
      >
        <FieldBlock label="Comentario Final" hint="Opcional — novedades generales del turno">
          <TextAreaField
            value={data.comentarioFinal || ""}
            onChange={set("comentarioFinal")}
            placeholder="Comentarios adicionales..."
          />
        </FieldBlock>
      </FormSection>
    </div>
  );
}
