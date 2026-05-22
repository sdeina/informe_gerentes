// ─────────────────────────────────────────────
//  CONFIGURACIÓN  ← cambiá solo este valor
// ─────────────────────────────────────────────
var SHEET_ID = "1WoRA7iJ81ocWNa7f1MRbpzcKJCd_U637pXAyfFhSje8";

var HEADERS = [
  "Timestamp", "Sala", "Fecha", "Gerente de Guardia",
  // 0. Registro de Personal
  "0 - Dotación Planificados",
  "0 - Dotación Presentes",
  "0 - Ausencias / Llegadas tarde",
  // 1. Apertura
  "1.1 Puestos críticos cubiertos",
  "1.1 Comentarios puestos críticos",
  "1.2 Presencia personal vestimenta reglamentaria",
  "1.2 Comentarios presencia personal",
  // 2. Infraestructura
  "2.1 Higiene General",
  "2.1 Sectores a reforzar",
  "2.2 Sala en condiciones adecuadas (Sí/No)",
  "2.2 Motivo si No",
  "2.3 Cartelería y promociones",
  "2.3 Comentarios cartelería",
  // 3. Seguridad
  "3.1 Presencia de Policía",
  "3.1 Comentarios policía",
  "3.2 Libro de Novedades Seguridad",
  "3.2 Novedades relevantes",
  "3.3 CCTV (Búnker)",
  "3.3 Comentarios CCTV",
  "3.4 Puertas de emergencia despejadas",
  "3.4 Comentarios emergencia",
  // 4. Fidelización
  "4.1 Clientes fidelizados",
  "4.2 Tuvo inconvenientes",
  "4.2 Detalle inconvenientes",
  "4.3 Sistema/PC fidelización OK",
  "4.3 Detalle problema sistema",
  "4.4 Queja cliente fidelización",
  "4.4 Detalle queja",
  // 5. Experiencia del Cliente
  "5.1 Ocupación 22:00",
  "5.1 Ocupación 02:00",
  "5.2 Clima VIP / Frecuentes",
  "5.2 Comentarios clientes",
  "5.3 Promociones / canje de puntos",
  "5.3 Comentarios promociones",
  "5.4 Atención rápida al cliente",
  "5.4 Motivo si no fue rápida",
  // 6. Cierre
  "6 - Comentario Final"
];

var FORM_KEYS = [
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
  "comentarioFinal"
];

var VALUE_LABELS = {
  si: "Sí",
  no: "No",
  excelente: "Excelente",
  adecuado: "Adecuado",
  mejorar: "A mejorar",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
  conformes: "Muy Conformes",
  neutrales: "Neutrales",
  quejas: "Con Quejas"
};

function formatValue(key, raw) {
  if (raw === undefined || raw === null || raw === "") return "";
  var str = String(raw);
  return VALUE_LABELS[str] || str;
}

function doPost(e) {
  var response;
  try {
    var payload = JSON.parse(e.postData.contents);
    response = guardarChecklist(payload);
  } catch (err) {
    response = { ok: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function guardarChecklist(datos) {
  try {
    if (!SHEET_ID || SHEET_ID === "TU_SPREADSHEET_ID_AQUI") {
      throw new Error("El SHEET_ID no está configurado en el Script de Google.");
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheetName = datos.sala || "General";
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold").setBackground("#000000").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    var form = datos.formData || {};
    var row = [
      new Date(),
      datos.sala,
      datos.fecha,
      datos.gerente
    ];

    FORM_KEYS.forEach(function(k) {
      row.push(formatValue(k, form[k]));
    });

    sheet.appendRow(row);
    return { ok: true, fila: sheet.getLastRow() };

  } catch (e) {
    return { ok: false, error: e.toString() };
  }
}
