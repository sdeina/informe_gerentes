// ─────────────────────────────────────────────
//  CONFIGURACIÓN  ← cambiá solo este valor
// ─────────────────────────────────────────────
var SHEET_ID = "1WoRA7iJ81ocWNa7f1MRbpzcKJCd_U637pXAyfFhSje8"; // ← ID proporcionado por el usuario

// ─────────────────────────────────────────────
//  ENCABEZADOS
// ─────────────────────────────────────────────
var HEADERS = [
  "Timestamp", "Sala", "Fecha", "Gerente de Guardia",
  // 1. Apertura
  "1.1 Verificar dotación completa de personal",
  "1.2 Confirmar puestos críticos cubiertos (caja, slots, seguridad, técnica, gastronomía)",
  "1.3 Revisar ausencias, llegadas tarde.",
  "1.4 Confirmar apertura operativa de todos los sectores.",
  "1.5 Verificar presentación general de sala.",
  "1.6 Controlar limpieza general, baños y áreas comunes.",
  "1.7 Revisar climatización, iluminación, música ambiente y aroma",
  "1.8 Confirmar funcionamiento de accesos y puertas de emergencia",
  // 2. Seguridad
  "2.1 Confirmar presencia de personal de seguridad",
  "2.2 Verificar funcionamiento de CCTV",
  "2.3 Revisar cobertura de cámaras en sectores sensibles",
  "2.4 Confirmar estado de matafuegos y salidas de emergencia visibles",
  "2.5 Confirmar que no haya situaciones sospechosas en sala",
  "2.6 Revisar libro de novedades de seguridad",
  // 3. Slots
  "3.1 Verificar porcentaje de máquinas operativas",
  "3.2 Revisar máquinas fuera de servicio y tiempo estimado de reparación",
  "3.3 Controlar orden y limpieza en parque de máquinas",
  "3.4 Verificar correcto funcionamiento de sistemas de tickets / cashless",
  "3.5 Revisar ocupación de sala y sectores calientes/fríos",
  "3.6 Confirmar que jackpots / progresivos / cartelería funcionen bien",
  "3.7 Verificar personal de sala visible y atento al cliente",
  "3.8 Revisar incidencias técnicas del turno",
  "3.9 Confirmar stock de insumos cajas de tito",
  // 4. Experiencia del cliente
  "4.1 Recorrer sala y saludar clientes frecuentes / VIP",
  "4.2 Controlar tiempos de atención al cliente",
  "4.3 Verificar calidad de atención del personal",
  "4.4 Revisar limpieza y orden en sectores de alto tránsito",
  "4.5 Confirmar servicio correcto en gastronomía / bar / café",
  "4.6 Verificar promociones, sorteos o activaciones del día",
  "4.7 Revisar cartelería, pantallas y comunicación vigente",
  "4.8 Confirmar resolución de quejas o reclamos abiertos",
  "4.9 Detectar oportunidades comerciales en sala",
  "4.10 Monitorear el frente del complejo, iluminación y limpieza",
  // 5. Personal y liderazgo
  "5.1 Observar desempeño de jefes",
  "5.2 Detectar necesidad de apoyo o redistribución de personal",
  "5.3 Corregir desvíos operativos en el momento",
  "5.4 Reconocer buenas prácticas del equipo y vestimenta",
  "5.5 Registrar faltas, incumplimientos o puntos de mejora",
  // 6. Seguimiento comercial
  "6.1 Revisar nivel de ocupación de sala",
  "6.2 Identificar franjas horarias de mayor tráfico",
  "6.3 Verificar rendimiento de promociones activas",
  "6.4 Controlar presencia de clientes frecuentes / VIP / nuevos",
  "6.5 Detectar oportunidades de fidelización",
  "6.6 Registrar comentarios del cliente útiles para futuras acciones",
  "6.7 Monitorear competencia / eventos externos si impactan en la sala",
  // Observaciones por sección
  "Obs. Apertura",
  "Obs. Seguridad",
  "Obs. Slots",
  "Obs. Experiencia",
  "Obs. Personal",
  "Obs. Comercial",
  // Observaciones final
  "Observaciones Importantes"
];

var OBS_KEYS = ["apertura", "seguridad", "slots", "experiencia", "personal", "comercial"];

// Orden de claves de los checkboxes (debe coincidir con el frontend)
var CHECK_KEYS = [
  "ap1","ap2","ap3","ap4","ap5","ap6","ap7","ap8",
  "seg1","seg2","seg3","seg4","seg5","seg6",
  "sl1","sl2","sl3","sl4","sl5","sl6","sl7","sl8","sl9",
  "exp1","exp2","exp3","exp4","exp5","exp6","exp7","exp8","exp9","exp10",
  "per1","per2","per3","per4","per5",
  "com1","com2","com3","com4","com5","com6","com7"
];

/**
 * Maneja solicitudes POST (API)
 */
function doPost(e) {
  var response;
  try {
    var payload = JSON.parse(e.postData.contents);
    var result = guardarChecklist(payload);
    response = result;
  } catch (err) {
    response = { ok: false, error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lógica de guardado (compartida)
 */
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

    var row = [
      new Date(),
      datos.sala,
      datos.fecha,
      datos.gerente
    ];

    CHECK_KEYS.forEach(function(k) {
      row.push(datos.checks[k] ? "✓" : "✗");
    });

    // Observaciones por sección
    OBS_KEYS.forEach(function(k) {
      row.push(datos.sectionObservations ? (datos.sectionObservations[k] || "") : "");
    });

    row.push(datos.observaciones || "");

    sheet.appendRow(row);
    return { ok: true, fila: sheet.getLastRow() };

  } catch (e) {
    return { ok: false, error: e.toString() };
  }
}
