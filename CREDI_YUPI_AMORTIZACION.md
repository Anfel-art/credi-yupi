# 🧮 CREDI YUPI — SISTEMA FRANCÉS DE AMORTIZACIÓN
> Lógica matemática completa, fórmulas y ejemplos

---

## 1. FUNDAMENTOS DEL SISTEMA FRANCÉS

El **Sistema Francés** (también llamado sistema de cuota fija) es el más utilizado 
en créditos de consumo. Su característica principal es que la **cuota mensual es 
siempre la misma**, pero su composición interna cambia:

```
Al inicio del préstamo:
  Cuota = [MUCHO interés  +  POCO capital]

Al final del préstamo:
  Cuota = [POCO interés   +  MUCHO capital]
```

### Comportamiento visual

```
Cuota mensual: CONSTANTE ────────────────────────────
                          █████████████████████████
                          █████████████████████████

Capital (crece):          ░░░░▒▒▒▓▓▓███████████████
                          ░→→→→→→→→→→→→→→→→→→→→→→→→

Interés (decrece):        ███████████▓▓▓▒▒▒░░░░░░░░
                          →→→→→→→→→→→→→→→→→→→→→→→→░
```

---

## 2. FÓRMULA MATEMÁTICA

### 2.1 Fórmula de Cuota Mensual

```
        P × i × (1 + i)ⁿ
C = ─────────────────────────
          (1 + i)ⁿ - 1

Donde:
  C = Cuota mensual fija (Gs.)
  P = Principal / Monto del préstamo (Gs.)
  i = Tasa de interés mensual (tasa anual / 12)
  n = Número total de cuotas (meses)
```

### 2.2 Desglose de cada cuota k

```
Interés_k   = Saldo_{k-1} × i
Capital_k   = C - Interés_k
Saldo_k     = Saldo_{k-1} - Capital_k

Donde:
  Saldo_0     = P  (saldo inicial = monto del préstamo)
  Interés_k   = porción de interés en la cuota k
  Capital_k   = porción de capital amortizado en la cuota k
```

### 2.3 Fórmulas alternativas directas

```
Para obtener el capital de la cuota k directamente:

  Capital_k = C × (1 + i)^(k-1) / (1 + i)^n

Para obtener el saldo después de la cuota k:

  Saldo_k = P × [(1+i)^n - (1+i)^k] / [(1+i)^n - 1]
```

---

## 3. EJEMPLO COMPLETO DE SIMULACIÓN

### Parámetros del ejemplo

```
┌─────────────────────────────────────────┐
│  DATOS DEL CRÉDITO                      │
│  ─────────────────────────────────────  │
│  Monto (P):        Gs. 3.000.000        │
│  Tasa anual (TNA): 28%                  │
│  Tasa mensual (i): 28% / 12 = 2,3333%  │
│                    = 0,023333           │
│  Plazo (n):        24 cuotas            │
└─────────────────────────────────────────┘
```

### Cálculo de la cuota mensual

```
Step 1: Calcular i
  i = 28% / 12 = 0,28 / 12 = 0,023333...

Step 2: Calcular (1 + i)^n
  (1 + 0,023333)^24 = (1,023333)^24
  = 1,023333^24 ≈ 1,73896

Step 3: Aplicar fórmula
           3.000.000 × 0,023333 × 1,73896
  C = ─────────────────────────────────────
                 1,73896 - 1

           3.000.000 × 0,040574
  C = ──────────────────────────
               0,73896

         121.722
  C = ──────────── = Gs. 164.715  (aprox.)
         0,73896

  C ≈ Gs. 164.715 por mes
```

### Verificación financiera

```
Total pagado:    Gs. 164.715 × 24 = Gs. 3.953.160
Capital:         Gs. 3.000.000
Costo financiero: Gs. 953.160
```

---

## 4. TABLA DE AMORTIZACIÓN COMPLETA (24 cuotas)

```
Préstamo: Gs. 3.000.000 | Tasa: 28% anual | Cuota: Gs. 164.715

Cuota │    Interés    │    Capital    │  Cuota Total  │ Saldo Restante
──────┼───────────────┼───────────────┼───────────────┼────────────────
  1   │    70.000     │    94.715     │   164.715     │  2.905.285
  2   │    67.790     │    96.925     │   164.715     │  2.808.360
  3   │    65.528     │    99.187     │   164.715     │  2.709.173
  4   │    63.214     │   101.501     │   164.715     │  2.607.672
  5   │    60.846     │   103.869     │   164.715     │  2.503.803
  6   │    58.422     │   106.293     │   164.715     │  2.397.510
  7   │    55.942     │   108.773     │   164.715     │  2.288.737
  8   │    53.404     │   111.311     │   164.715     │  2.177.426
  9   │    50.807     │   113.908     │   164.715     │  2.063.518
 10   │    48.149     │   116.566     │   164.715     │  1.946.952
 11   │    45.429     │   119.286     │   164.715     │  1.827.666
 12   │    42.646     │   122.069     │   164.715     │  1.705.597
──────┼───────────────┼───────────────┼───────────────┼────────────────
      │  SUBTOTAL AÑO 1                                               │
      │  Interés: Gs. 682.177  │  Capital: Gs. 1.294.403             │
──────┼───────────────┼───────────────┼───────────────┼────────────────
 13   │    39.797     │   124.918     │   164.715     │  1.580.679
 14   │    36.883     │   127.832     │   164.715     │  1.452.847
 15   │    33.900     │   130.815     │   164.715     │  1.322.032
 16   │    30.847     │   133.868     │   164.715     │  1.188.164
 17   │    27.724     │   136.991     │   164.715     │  1.051.173
 18   │    24.527     │   140.188     │   164.715     │    910.985
 19   │    21.256     │   143.459     │   164.715     │    767.526
 20   │    17.909     │   146.806     │   164.715     │    620.720
 21   │    14.483     │   150.232     │   164.715     │    470.488
 22   │    10.978     │   153.737     │   164.715     │    316.751
 23   │     7.391     │   157.324     │   164.715     │    159.427
 24   │     3.720     │   160.995     │   164.715     │          0
──────┼───────────────┼───────────────┼───────────────┼────────────────
      │  SUBTOTAL AÑO 2                                               │
      │  Interés: Gs. 269.415  │  Capital: Gs. 1.705.164             │
──────┴───────────────┴───────────────┴───────────────┴────────────────
TOTAL │  Gs. 951.592  │ Gs. 3.000.000 │ Gs. 3.951.592 │              0
```

*Nota: pequeñas diferencias de redondeo (±Gs. 1-2) en última cuota se ajustan automáticamente.*

---

## 5. IMPLEMENTACIÓN EN CÓDIGO

### 5.1 TypeScript / React Native (Frontend)

```typescript
// utils/amortizacion.ts

export interface ParametrosCredito {
  monto: number;        // En Guaraníes
  tasaAnual: number;    // Decimal: 0.28 para 28%
  plazoMeses: number;   // Número de cuotas
}

export interface CuotaAmortizacion {
  numeroCuota: number;
  fechaVencimiento: Date;
  cuotaTotal: number;
  interes: number;
  capital: number;
  saldoRestante: number;
}

export interface ResultadoSimulacion {
  cuotaMensual: number;
  tasaMensual: number;
  totalPagar: number;
  costoFinanciero: number;
  tablaAmortizacion: CuotaAmortizacion[];
}

/**
 * Calcula la cuota mensual fija usando el Sistema Francés
 * Fórmula: C = P * i * (1+i)^n / ((1+i)^n - 1)
 */
export function calcularCuotaMensual(
  monto: number,
  tasaAnual: number,
  plazoMeses: number
): number {
  const i = tasaAnual / 12;
  const factor = Math.pow(1 + i, plazoMeses);
  const cuota = (monto * i * factor) / (factor - 1);
  return Math.round(cuota); // Redondear a Gs. enteros
}

/**
 * Genera la tabla de amortización completa
 */
export function generarAmortizacion(
  params: ParametrosCredito,
  fechaInicio: Date = new Date()
): ResultadoSimulacion {
  const { monto, tasaAnual, plazoMeses } = params;
  const i = tasaAnual / 12;
  const cuotaMensual = calcularCuotaMensual(monto, tasaAnual, plazoMeses);
  
  const tabla: CuotaAmortizacion[] = [];
  let saldoAnterior = monto;
  
  for (let k = 1; k <= plazoMeses; k++) {
    // Calcular interés del período
    const interes = Math.round(saldoAnterior * i);
    
    // Calcular capital amortizado
    let capital = cuotaMensual - interes;
    
    // Ajuste en la última cuota para saldar exactamente
    if (k === plazoMeses) {
      capital = saldoAnterior;
    }
    
    const saldoRestante = Math.max(0, saldoAnterior - capital);
    
    // Calcular fecha de vencimiento
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + k);
    
    tabla.push({
      numeroCuota: k,
      fechaVencimiento: fecha,
      cuotaTotal: capital + interes,
      interes,
      capital,
      saldoRestante,
    });
    
    saldoAnterior = saldoRestante;
  }
  
  const totalPagar = tabla.reduce((sum, c) => sum + c.cuotaTotal, 0);
  
  return {
    cuotaMensual,
    tasaMensual: i,
    totalPagar,
    costoFinanciero: totalPagar - monto,
    tablaAmortizacion: tabla,
  };
}

/**
 * Calcula penalización por mora
 * Tasa mora: 1.5x la tasa mensual por día de retraso
 */
export function calcularMora(
  saldoCuota: number,
  tasaMensual: number,
  diasRetraso: number
): number {
  const tasaDiariaMora = (tasaMensual * 1.5) / 30;
  return Math.round(saldoCuota * tasaDiariaMora * diasRetraso);
}

// ============================================================
// EJEMPLO DE USO
// ============================================================
const simulacion = generarAmortizacion({
  monto: 3_000_000,
  tasaAnual: 0.28,
  plazoMeses: 24,
});

console.log(`Cuota mensual: Gs. ${simulacion.cuotaMensual.toLocaleString('es-PY')}`);
console.log(`Total a pagar: Gs. ${simulacion.totalPagar.toLocaleString('es-PY')}`);
console.log(`Costo financiero: Gs. ${simulacion.costoFinanciero.toLocaleString('es-PY')}`);
```

### 5.2 Node.js / Backend (API)

```javascript
// services/creditService.js

const calcularCredito = (monto, tasaAnual, plazoMeses) => {
  const i = tasaAnual / 12;
  const factor = Math.pow(1 + i, plazoMeses);
  const cuota = Math.round((monto * i * factor) / (factor - 1));
  
  const tabla = [];
  let saldo = monto;
  
  for (let k = 1; k <= plazoMeses; k++) {
    const interes = Math.round(saldo * i);
    const capital = k === plazoMeses ? saldo : cuota - interes;
    saldo = Math.max(0, saldo - capital);
    
    tabla.push({
      cuota: k,
      interes,
      capital,
      cuotaTotal: capital + interes,
      saldoRestante: saldo,
    });
  }
  
  const totalPagar = tabla.reduce((s, c) => s + c.cuotaTotal, 0);
  
  return {
    cuotaMensual: cuota,
    tasaMensual: Number((i * 100).toFixed(4)),
    tasaAnual: Number((tasaAnual * 100).toFixed(2)),
    totalPagar,
    costoFinanciero: totalPagar - monto,
    tablaAmortizacion: tabla,
  };
};

// API Endpoint
// POST /api/creditos/simular
const simularCredito = async (req, res) => {
  const { monto, tasaAnual, plazoMeses } = req.body;
  
  // Validaciones
  if (monto < 500_000 || monto > 15_000_000) {
    return res.status(400).json({ error: 'Monto fuera de rango permitido' });
  }
  if (plazoMeses < 6 || plazoMeses > 24) {
    return res.status(400).json({ error: 'Plazo fuera de rango permitido' });
  }
  
  const resultado = calcularCredito(monto, tasaAnual, plazoMeses);
  return res.json(resultado);
};

module.exports = { calcularCredito, simularCredito };
```

### 5.3 SQL — Generar tabla de amortización en BD

```sql
-- Función PostgreSQL para generar amortización
CREATE OR REPLACE FUNCTION generar_amortizacion(
  p_credito_id    UUID,
  p_monto         NUMERIC,
  p_tasa_anual    NUMERIC,
  p_plazo_meses   INTEGER,
  p_fecha_inicio  DATE
)
RETURNS VOID AS $$
DECLARE
  v_i          NUMERIC;
  v_factor     NUMERIC;
  v_cuota      NUMERIC;
  v_saldo      NUMERIC;
  v_interes    NUMERIC;
  v_capital    NUMERIC;
  v_fecha      DATE;
  k            INTEGER;
BEGIN
  v_i := p_tasa_anual / 12;
  v_factor := POWER(1 + v_i, p_plazo_meses);
  v_cuota := ROUND((p_monto * v_i * v_factor) / (v_factor - 1));
  v_saldo := p_monto;
  
  FOR k IN 1..p_plazo_meses LOOP
    v_interes := ROUND(v_saldo * v_i);
    
    IF k = p_plazo_meses THEN
      v_capital := v_saldo;  -- Ajuste última cuota
    ELSE
      v_capital := v_cuota - v_interes;
    END IF;
    
    v_saldo := GREATEST(0, v_saldo - v_capital);
    v_fecha := p_fecha_inicio + (k * INTERVAL '1 month')::DATE - p_fecha_inicio;
    v_fecha := p_fecha_inicio + (k || ' months')::INTERVAL;
    
    INSERT INTO tabla_amortizacion (
      credito_id, numero_cuota, fecha_vencimiento,
      cuota_total, interes, capital, saldo_restante
    ) VALUES (
      p_credito_id, k, v_fecha,
      v_capital + v_interes, v_interes, v_capital, v_saldo
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. TABLA DE TASAS POR PERFIL DE CLIENTE

```
SEGMENTACIÓN DE TASAS — CREDI YUPI
────────────────────────────────────────────────────────────

Score        Perfil          Tasa Anual    Monto Máximo
─────────────────────────────────────────────────────────
800 - 1000   PLATINUM        18% - 22%    Gs. 15.000.000
700 - 799    GOLD            22% - 25%    Gs. 10.000.000
600 - 699    SILVER          25% - 28%    Gs.  6.000.000
500 - 599    BÁSICO          28% - 30%    Gs.  3.000.000
< 500        NO CALIFICA     —            —

NOTA: Tasas dentro del límite legal BCP Paraguay (30% TEA máx.)
```

---

## 7. EJEMPLOS DE SIMULACIÓN RÁPIDA

```
TABLA COMPARATIVA — MONTOS Y PLAZOS MÁS COMUNES
(Tasa anual: 28%)

Monto         │  6 meses  │  12 meses │  18 meses │  24 meses
──────────────┼───────────┼───────────┼───────────┼───────────
Gs.   500.000 │  Gs. 88K  │  Gs. 48K  │  Gs. 34K  │  Gs. 27K
Gs. 1.000.000 │  Gs.175K  │  Gs. 95K  │  Gs. 68K  │  Gs. 55K
Gs. 2.000.000 │  Gs.350K  │  Gs.190K  │  Gs.137K  │  Gs.110K
Gs. 3.000.000 │  Gs.525K  │  Gs.285K  │  Gs.205K  │  Gs.165K
Gs. 5.000.000 │  Gs.875K  │  Gs.476K  │  Gs.342K  │  Gs.275K
Gs.10.000.000 │  Gs.1.75M │  Gs.951K  │  Gs.684K  │  Gs.549K
Gs.15.000.000 │  Gs.2.62M │  Gs.1.43M │  Gs.1.03M │  Gs.824K

K = miles de Guaraníes | M = millones de Guaraníes
```

---

## 8. CÁLCULO DE MORA

```
PENALIZACIÓN POR MORA
──────────────────────

Tasa de mora diaria = Tasa mensual × 1.5 / 30 días

Ejemplo:
  Tasa mensual: 2.33%
  Tasa mora diaria: 2.33% × 1.5 / 30 = 0.1167% diario

  Cuota impaga: Gs. 165.000
  Días de retraso: 10 días
  Mora = Gs. 165.000 × 0.001167 × 10 = Gs. 1.925

RANGOS DE MORA:
  1-7 días   → Solo recordatorio, sin penalización
  8-30 días  → Mora sobre cuota impaga
  31-60 días → Mora + reporte a bureau de crédito
  61-90 días → Inicio gestión de cobranza
  > 90 días  → Castigo contable + gestión judicial
```
