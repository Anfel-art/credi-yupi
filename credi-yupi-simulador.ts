/**
 * CREDI YUPI — Motor de Cálculo Financiero
 * Sistema Francés de Amortización
 * Adaptado al mercado paraguayo (Guaraníes)
 */

// ============================================================
// TIPOS
// ============================================================

export interface ParametrosCredito {
  monto: number;       // Guaraníes: 500.000 a 15.000.000
  tasaAnual: number;   // Decimal: 0.28 = 28% anual
  plazoMeses: number;  // 6, 12, 18 o 24
  fechaInicio?: Date;
}

export interface CuotaDetalle {
  numero: number;
  fechaVencimiento: string;   // "DD/MM/YYYY"
  cuotaTotal: number;
  interes: number;
  capital: number;
  saldoRestante: number;
  estado: "PENDIENTE" | "PAGADA" | "VENCIDA";
}

export interface ResultadoCredito {
  // Parámetros de entrada
  monto: number;
  tasaAnual: number;
  tasaMensual: number;
  plazoMeses: number;

  // Resultados clave
  cuotaMensual: number;
  totalPagar: number;
  costoFinanciero: number;
  cae: number;  // Costo Anual Efectivo

  // Tabla completa
  tabla: CuotaDetalle[];
}

export interface PerfilCliente {
  score: number;         // 0 a 1000
  ingresoMensual: number;  // Guaraníes
  tipoIngreso: "ASALARIADO" | "EMPRENDEDOR" | "OTRO";
  mesesEnSistema: number;  // Antigüedad en Credi Yupi
  creditosPrevios: number;
  morasHistorial: number;
}

export interface OfertaPersonalizada {
  tasaAnual: number;
  montoMaximo: number;
  segmento: "PLATINUM" | "GOLD" | "SILVER" | "BASICO" | "NO_CALIFICA";
  razon?: string;
}

// ============================================================
// CONSTANTES DEL NEGOCIO
// ============================================================

export const LIMITES = {
  MONTO_MIN: 500_000,
  MONTO_MAX: 15_000_000,
  PLAZO_MIN: 6,
  PLAZO_MAX: 24,
  TASA_MINIMA: 0.18,    // 18% anual (clientes platinum)
  TASA_MAXIMA: 0.30,    // 30% anual (límite BCP Paraguay)
  RATIO_CUOTA_INGRESO_MAX: 0.40,  // 40% del ingreso
  MORA_MULTIPLICADOR: 1.5,         // 1.5x la tasa mensual
  DIAS_GRACIA_MORA: 7,
} as const;

const SEGMENTOS: Record<string, { tasaAnual: number; montoMax: number }> = {
  PLATINUM: { tasaAnual: 0.20, montoMax: 15_000_000 },
  GOLD:     { tasaAnual: 0.25, montoMax: 10_000_000 },
  SILVER:   { tasaAnual: 0.28, montoMax:  6_000_000 },
  BASICO:   { tasaAnual: 0.30, montoMax:  3_000_000 },
};

// ============================================================
// CALCULADORA SISTEMA FRANCÉS
// ============================================================

/**
 * Cuota fija mensual (Sistema Francés)
 * C = P × i × (1+i)^n / ((1+i)^n - 1)
 */
export function calcularCuotaMensual(
  monto: number,
  tasaAnual: number,
  plazoMeses: number
): number {
  const i = tasaAnual / 12;
  const factor = Math.pow(1 + i, plazoMeses);
  const cuota = (monto * i * factor) / (factor - 1);
  return Math.round(cuota);
}

/**
 * Genera la tabla de amortización completa con el Sistema Francés.
 *
 * En el Sistema Francés:
 *   - Cuota mensual: CONSTANTE
 *   - Porción de interés: DECRECIENTE (sobre saldo)
 *   - Porción de capital: CRECIENTE
 */
export function calcularAmortizacion(params: ParametrosCredito): ResultadoCredito {
  const { monto, tasaAnual, plazoMeses, fechaInicio = new Date() } = params;

  validarParametros(params);

  const i = tasaAnual / 12;
  const cuotaMensual = calcularCuotaMensual(monto, tasaAnual, plazoMeses);

  const tabla: CuotaDetalle[] = [];
  let saldo = monto;
  let totalPagado = 0;

  for (let k = 1; k <= plazoMeses; k++) {
    // Interés del período: sobre el saldo anterior
    const interes = Math.round(saldo * i);

    // Capital amortizado: cuota menos interés
    // En la última cuota se salda el saldo exacto (ajuste de redondeo)
    const capital = k === plazoMeses ? saldo : cuotaMensual - interes;

    const cuotaTotal = interes + capital;
    saldo = Math.max(0, saldo - capital);

    // Fecha de vencimiento: k meses desde la fecha de inicio
    const fechaVenc = new Date(fechaInicio);
    fechaVenc.setMonth(fechaVenc.getMonth() + k);

    tabla.push({
      numero: k,
      fechaVencimiento: formatearFecha(fechaVenc),
      cuotaTotal,
      interes,
      capital,
      saldoRestante: saldo,
      estado: "PENDIENTE",
    });

    totalPagado += cuotaTotal;
  }

  const costoFinanciero = totalPagado - monto;

  // CAE: Costo Anual Efectivo aproximado
  const cae = calcularCAE(monto, cuotaMensual, plazoMeses, i);

  return {
    monto,
    tasaAnual,
    tasaMensual: i,
    plazoMeses,
    cuotaMensual,
    totalPagar: totalPagado,
    costoFinanciero,
    cae,
    tabla,
  };
}

/**
 * Costo Anual Efectivo (CAE): convierte la tasa mensual nominal en tasa efectiva anual
 * CAE = (1 + i_mensual)^12 - 1
 * Donde i_mensual es la tasa mensual del crédito (tasaAnual / 12)
 */
function calcularCAE(
  _monto: number,
  _cuotaMensual: number,
  _plazoMeses: number,
  tasaMensual?: number
): number {
  // Si se pasa la tasa mensual, usarla directamente
  if (tasaMensual !== undefined) {
    return Math.round((Math.pow(1 + tasaMensual, 12) - 1) * 10000) / 100;
  }
  return 0;
}

// ============================================================
// SCORING Y OFERTA PERSONALIZADA
// ============================================================

/**
 * Determina la oferta personalizada según el perfil del cliente
 */
export function calcularOferta(perfil: PerfilCliente): OfertaPersonalizada {
  const { score, ingresoMensual, tipoIngreso, creditosPrevios, morasHistorial } = perfil;

  // Exclusiones automáticas
  if (score < 500) {
    return {
      tasaAnual: 0,
      montoMaximo: 0,
      segmento: "NO_CALIFICA",
      razon: "Score crediticio insuficiente. Mejorá tu historial de pagos.",
    };
  }

  if (morasHistorial > 2) {
    return {
      tasaAnual: 0,
      montoMaximo: 0,
      segmento: "NO_CALIFICA",
      razon: "Historial con múltiples moras. Regularizá tus deudas primero.",
    };
  }

  // Determinar segmento por score
  let segmento: keyof typeof SEGMENTOS;
  if (score >= 800) segmento = "PLATINUM";
  else if (score >= 700) segmento = "GOLD";
  else if (score >= 600) segmento = "SILVER";
  else segmento = "BASICO";

  const { tasaAnual, montoMax } = SEGMENTOS[segmento];

  // Limitar monto según capacidad de pago (máx. 40% del ingreso mensual)
  const cuotaMaxPermitida = ingresoMensual * LIMITES.RATIO_CUOTA_INGRESO_MAX;
  // Cuánto podría pagar en un crédito a 24 meses con la tasa del segmento
  const montoMaxPorIngreso = Math.floor(
    (cuotaMaxPermitida * (Math.pow(1 + tasaAnual / 12, 24) - 1)) /
    ((tasaAnual / 12) * Math.pow(1 + tasaAnual / 12, 24)) / 1000
  ) * 1000;

  const montoMaximo = Math.min(montoMax, montoMaxPorIngreso, LIMITES.MONTO_MAX);

  // Bonus por buen historial interno
  const tasaFinal = creditosPrevios > 0 && morasHistorial === 0
    ? tasaAnual - 0.01  // -1% por buen historial
    : tasaAnual;

  return {
    tasaAnual: Math.max(tasaFinal, LIMITES.TASA_MINIMA),
    montoMaximo: Math.max(montoMaximo, LIMITES.MONTO_MIN),
    segmento: segmento as OfertaPersonalizada["segmento"],
  };
}

// ============================================================
// CÁLCULO DE MORA
// ============================================================

/**
 * Calcula intereses por mora sobre una cuota vencida
 */
export function calcularMora(
  montoCuota: number,
  tasaMensual: number,
  diasRetraso: number
): { montoMora: number; diasEfectivos: number } {
  const diasEfectivos = Math.max(0, diasRetraso - LIMITES.DIAS_GRACIA_MORA);
  if (diasEfectivos === 0) return { montoMora: 0, diasEfectivos: 0 };

  const tasaDiariaMora = (tasaMensual * LIMITES.MORA_MULTIPLICADOR) / 30;
  const montoMora = Math.round(montoCuota * tasaDiariaMora * diasEfectivos);

  return { montoMora, diasEfectivos };
}

// ============================================================
// VALIDACIONES
// ============================================================

function validarParametros(params: ParametrosCredito): void {
  const { monto, tasaAnual, plazoMeses } = params;
  const errores: string[] = [];

  if (monto < LIMITES.MONTO_MIN || monto > LIMITES.MONTO_MAX) {
    errores.push(`Monto debe estar entre Gs. ${fmtGs(LIMITES.MONTO_MIN)} y Gs. ${fmtGs(LIMITES.MONTO_MAX)}`);
  }
  if (plazoMeses < LIMITES.PLAZO_MIN || plazoMeses > LIMITES.PLAZO_MAX) {
    errores.push(`Plazo debe estar entre ${LIMITES.PLAZO_MIN} y ${LIMITES.PLAZO_MAX} meses`);
  }
  if (tasaAnual < LIMITES.TASA_MINIMA || tasaAnual > LIMITES.TASA_MAXIMA) {
    errores.push(`Tasa anual debe estar entre ${LIMITES.TASA_MINIMA * 100}% y ${LIMITES.TASA_MAXIMA * 100}%`);
  }

  if (errores.length > 0) {
    throw new Error(errores.join(" | "));
  }
}

// ============================================================
// UTILIDADES DE FORMATO
// ============================================================

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function fmtGs(valor: number): string {
  return valor.toLocaleString("es-PY");
}

export function formatearGuaranies(valor: number): string {
  return `Gs. ${valor.toLocaleString("es-PY")}`;
}

// ============================================================
// DEMO / EJEMPLO DE USO
// ============================================================

function demo(): void {
  console.log("═".repeat(65));
  console.log("  CREDI YUPI — SIMULACIÓN DE CRÉDITO");
  console.log("═".repeat(65));

  const params: ParametrosCredito = {
    monto: 3_000_000,
    tasaAnual: 0.28,
    plazoMeses: 24,
    fechaInicio: new Date("2026-06-01"),
  };

  console.log(`\n  Monto:       ${formatearGuaranies(params.monto)}`);
  console.log(`  Tasa anual:  ${(params.tasaAnual * 100).toFixed(2)}%`);
  console.log(`  Plazo:       ${params.plazoMeses} meses`);

  const resultado = calcularAmortizacion(params);

  console.log("\n" + "─".repeat(65));
  console.log("  RESULTADO");
  console.log("─".repeat(65));
  console.log(`  Cuota mensual:     ${formatearGuaranies(resultado.cuotaMensual)}`);
  console.log(`  Tasa mensual:      ${(resultado.tasaMensual * 100).toFixed(4)}%`);
  console.log(`  Total a pagar:     ${formatearGuaranies(resultado.totalPagar)}`);
  console.log(`  Costo financiero:  ${formatearGuaranies(resultado.costoFinanciero)}`);
  console.log(`  CAE (TIR anual):   ${resultado.cae}%`);

  console.log("\n" + "─".repeat(65));
  console.log("  TABLA DE AMORTIZACIÓN");
  console.log("─".repeat(65));
  console.log("  Cuota │ Vencimiento │   Interés   │   Capital   │    Saldo");
  console.log("  ──────┼─────────────┼─────────────┼─────────────┼───────────────");

  // Mostrar primeras 3, puntos suspensivos, últimas 3
  const mostrar = [
    ...resultado.tabla.slice(0, 3),
    null,
    ...resultado.tabla.slice(-3),
  ];

  mostrar.forEach((cuota) => {
    if (!cuota) {
      console.log("    ...  │     ...     │     ...     │     ...     │      ...");
      return;
    }
    const n = String(cuota.numero).padStart(4);
    const f = cuota.fechaVencimiento.padEnd(11);
    const i = fmtGs(cuota.interes).padStart(11);
    const c = fmtGs(cuota.capital).padStart(11);
    const s = fmtGs(cuota.saldoRestante).padStart(13);
    console.log(`  ${n}  │ ${f} │ ${i} │ ${c} │ ${s}`);
  });

  console.log("  ──────┴─────────────┴─────────────┴─────────────┴───────────────");

  const totI = resultado.tabla.reduce((s, c) => s + c.interes, 0);
  const totC = resultado.tabla.reduce((s, c) => s + c.capital, 0);
  console.log(`  TOTAL │             │ ${fmtGs(totI).padStart(11)} │ ${fmtGs(totC).padStart(11)} │`);

  // Ejemplo de mora
  console.log("\n" + "─".repeat(65));
  console.log("  EJEMPLO DE CÁLCULO DE MORA");
  console.log("─".repeat(65));
  const mora = calcularMora(resultado.cuotaMensual, resultado.tasaMensual, 15);
  console.log(`  Cuota impaga:    ${formatearGuaranies(resultado.cuotaMensual)}`);
  console.log(`  Días de retraso: 15 días (gracia: ${LIMITES.DIAS_GRACIA_MORA} días)`);
  console.log(`  Días efectivos:  ${mora.diasEfectivos} días`);
  console.log(`  Interés mora:    ${formatearGuaranies(mora.montoMora)}`);
  console.log(`  TOTAL a pagar:   ${formatearGuaranies(resultado.cuotaMensual + mora.montoMora)}`);

  // Ejemplo de oferta personalizada
  console.log("\n" + "─".repeat(65));
  console.log("  OFERTA PERSONALIZADA SEGÚN PERFIL");
  console.log("─".repeat(65));

  const perfil: PerfilCliente = {
    score: 720,
    ingresoMensual: 2_500_000,
    tipoIngreso: "ASALARIADO",
    mesesEnSistema: 8,
    creditosPrevios: 1,
    morasHistorial: 0,
  };

  const oferta = calcularOferta(perfil);
  console.log(`  Score:           ${perfil.score}`);
  console.log(`  Ingreso mensual: ${formatearGuaranies(perfil.ingresoMensual)}`);
  console.log(`  Segmento:        ${oferta.segmento}`);
  console.log(`  Tasa ofertada:   ${(oferta.tasaAnual * 100).toFixed(0)}% anual`);
  console.log(`  Monto máximo:    ${formatearGuaranies(oferta.montoMaximo)}`);

  console.log("\n" + "═".repeat(65));
  console.log("  ¡Credi Yupi — Tu dinero, rápido y sin complicaciones!");
  console.log("═".repeat(65) + "\n");
}

demo();
