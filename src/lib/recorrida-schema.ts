export type FormData = Record<string, string>;

const NUMBER_KEYS = ["dotacionPlanificados", "dotacionPresentes", "fidelizacionCantidad"];

/** Respuestas principales siempre obligatorias */
export const BASE_REQUIRED_KEYS: string[] = [
  "dotacionPlanificados",
  "dotacionPresentes",
  "ausenciasLlegadasTarde",
  "puestosCriticos",
  "presenciaPersonal",
  "higieneGeneral",
  "confortAmbiental",
  "carteleriaPromos",
  "presenciaPolicia",
  "libroNovedades",
  "cctv",
  "puertasEmergencia",
  "fidelizacionCantidad",
  "fidelizacionInconveniente",
  "fidelizacionSistemaOk",
  "fidelizacionQuejaCliente",
  "ocupacion2200",
  "ocupacion0200",
  "climaVip",
  "promociones",
  "atencionRapida",
];

export function isScaleNeedsComment(value: string | undefined): boolean {
  return value === "adecuado" || value === "mejorar";
}

export function isVipNeedsComment(value: string | undefined): boolean {
  return value === "neutrales" || value === "quejas";
}

/** Claves de comentario que son obligatorias según las respuestas actuales */
export function getConditionalRequiredKeys(data: FormData): string[] {
  const keys: string[] = [];

  if (data.puestosCriticos === "no") keys.push("puestosCriticosComentarios");
  if (isScaleNeedsComment(data.presenciaPersonal)) keys.push("presenciaPersonalComentarios");
  if (isScaleNeedsComment(data.higieneGeneral)) keys.push("higieneSectoresReforzar");
  if (data.confortAmbiental === "no") keys.push("confortAmbientalComentarios");
  if (data.carteleriaPromos === "no") keys.push("carteleriaComentarios");
  if (data.presenciaPolicia === "no") keys.push("presenciaPoliciaComentarios");
  if (data.libroNovedades === "no") keys.push("libroNovedadesDetalle");
  if (data.cctv === "no") keys.push("cctvComentarios");
  if (data.puertasEmergencia === "no") keys.push("puertasEmergenciaComentarios");

  if (data.fidelizacionInconveniente === "si") keys.push("fidelizacionInconvenienteComentarios");
  if (data.fidelizacionSistemaOk === "no") keys.push("fidelizacionSistemaComentarios");
  if (data.fidelizacionQuejaCliente === "si") keys.push("fidelizacionQuejaComentarios");

  if (isVipNeedsComment(data.climaVip)) keys.push("vipComentarios");
  if (data.promociones === "no") keys.push("promocionesComentarios");
  if (data.atencionRapida === "no") keys.push("atencionRapidaComentarios");

  return keys;
}

export function getAllRequiredKeys(data: FormData): string[] {
  return [...BASE_REQUIRED_KEYS, ...getConditionalRequiredKeys(data)];
}

export function isFieldComplete(key: string, data: FormData): boolean {
  const value = data[key];
  if (value === undefined || value === null) return false;
  if (NUMBER_KEYS.includes(key)) {
    return value !== "" && !Number.isNaN(Number(value));
  }
  return String(value).trim().length > 0;
}

export function countCompleted(data: FormData): number {
  return getAllRequiredKeys(data).filter((k) => isFieldComplete(k, data)).length;
}

export function totalRequired(data: FormData): number {
  return getAllRequiredKeys(data).length;
}

export function isFormComplete(data: FormData): boolean {
  return getAllRequiredKeys(data).every((k) => isFieldComplete(k, data));
}

/** Orden de columnas en Google Sheets */
export const FORM_KEYS: string[] = [
  "dotacionPlanificados",
  "dotacionPresentes",
  "ausenciasLlegadasTarde",
  "puestosCriticos",
  "puestosCriticosComentarios",
  "presenciaPersonal",
  "presenciaPersonalComentarios",
  "higieneGeneral",
  "higieneSectoresReforzar",
  "confortAmbiental",
  "confortAmbientalComentarios",
  "carteleriaPromos",
  "carteleriaComentarios",
  "presenciaPolicia",
  "presenciaPoliciaComentarios",
  "libroNovedades",
  "libroNovedadesDetalle",
  "cctv",
  "cctvComentarios",
  "puertasEmergencia",
  "puertasEmergenciaComentarios",
  "fidelizacionCantidad",
  "fidelizacionInconveniente",
  "fidelizacionInconvenienteComentarios",
  "fidelizacionSistemaOk",
  "fidelizacionSistemaComentarios",
  "fidelizacionQuejaCliente",
  "fidelizacionQuejaComentarios",
  "ocupacion2200",
  "ocupacion0200",
  "climaVip",
  "vipComentarios",
  "promociones",
  "promocionesComentarios",
  "atencionRapida",
  "atencionRapidaComentarios",
  "comentarioFinal",
];
