# 💰 CREDI YUPI — MONETIZACIÓN, ROADMAP Y RECOMENDACIONES
> Estrategia de negocio, ingresos y plan de lanzamiento

---

## 1. MODELO DE MONETIZACIÓN

### 1.1 Ingresos Directos (Core)

```
FUENTE PRINCIPAL: SPREAD DE TASA
─────────────────────────────────
Costo de fondeo (si aplica): ~8-10% anual
Tasa cobrada al cliente:     18-30% anual
Spread neto:                 8-22 puntos porcentuales

Por cada Gs. 10.000.000 colocado:
  Ingreso bruto anual: Gs. 1.800.000 - 3.000.000
```

```
COMISIONES ADICIONALES PERMITIDAS (BCP Paraguay)

Concepto                        Monto / %
─────────────────────────────────────────────────
Gastos administrativos          0.5% - 1% del monto
Seguro de vida desgravamen      0.1% - 0.2% mensual
Penalización por pago anticipado 1% del capital adelantado
Cargos por mora                 1.5x tasa mensual/día
```

### 1.2 Ingresos por Servicios Adicionales (Fase 2+)

```
SERVICIOS ANCLA (agrega valor al usuario, genera ingreso)

Servicio                 Modelo de ingreso
──────────────────────────────────────────────────────────
Pago de facturas ANDE    Comisión 1-2% por transacción
Recargas telefónicas     Margen 3-5% por recarga
Seguro micro-PyME        Fee mensual Gs. 15.000-50.000
Billetera digital        Float sobre saldos depositados
Marketplace de aliados   CPA (costo por adquisición) de comercios
Datos de crédito         Venta agregada y anonimizada a fondos
```

### 1.3 Proyección de Ingresos (Año 1)

```
ESCENARIO CONSERVADOR — AÑO 1

Mes 1-3:   Fase beta. 50 créditos promedio/mes. Gs. 50M colocados
Mes 4-6:   Crecimiento. 150 créditos/mes. Gs. 150M colocados
Mes 7-12:  Tracción. 400 créditos/mes. Gs. 400M colocados

Cartera total fin de año 1: ~Gs. 2.000M (USD 270K aprox.)
Ingreso bruto estimado:      Gs. 560M anuales (tasa 28%)
Gastos operativos:           Gs. 280M
EBITDA estimado Año 1:       Gs. 280M (~USD 38K)

CRECIMIENTO OBJETIVO:
  Año 1: 2.000 clientes activos
  Año 2: 8.000 clientes activos
  Año 3: 25.000 clientes activos
```

---

## 2. ESTRUCTURA DE COSTOS

```
COSTOS OPERATIVOS ESTIMADOS (MENSUAL)

Item                          Costo Mensual (Gs.)
───────────────────────────────────────────────────
AWS Cloud (infra)              1.500.000 - 3.000.000
Firebase / FCM                 Gratuito hasta 10K MAU
Twilio SMS OTP                 500.000 - 1.500.000
Equifax API (scoring)          250.000 por consulta
Bancard (transacciones)        0.5% por transacción
AWS Rekognition (OCR)          100 Gs. por imagen
Soporte al cliente (2 agentes) 3.000.000 - 5.000.000
Hosting / dominio              Incluido en AWS
───────────────────────────────────────────────────
TOTAL FIJO ESTIMADO:           ~7.000.000 Gs./mes
```

---

## 3. ROADMAP DE DESARROLLO

### FASE 0 — Fundación (Mes 1-2)
```
▶ Constitución legal (SRL o SA en Paraguay)
▶ Registro en BCP como IMEF (Institución Financiera No Bancaria)
▶ Registro en SEPRELAD (prevención lavado de dinero)
▶ Contratación equipo core (2 devs, 1 PM, 1 analista crédito)
▶ Definición de arquitectura técnica
▶ Wireframes y diseño UI/UX
▶ Captación de fondeo inicial
```

### FASE 1 — MVP (Mes 3-5)
```
▶ App básica con:
  ✓ Registro de usuario (KYC básico)
  ✓ Simulador de crédito
  ✓ Solicitud digital simple
  ✓ Aprobación manual con scoring básico
  ✓ Notificaciones push
  ✓ Dashboard básico (crédito activo + cuotas)
▶ Beta cerrada: 50 usuarios seleccionados
▶ Integración Bancard básica
```

### FASE 2 — Lanzamiento (Mes 6-8)
```
▶ Scoring automatizado completo
▶ Integración Equifax Paraguay
▶ KYC con OCR de cédula
▶ Aprobación automática 24/7
▶ Tabla de amortización en app
▶ Historial de créditos
▶ Notificaciones de pago
▶ Lanzamiento en Play Store y App Store
▶ Campaña de adquisición digital (Meta/TikTok Ads)
```

### FASE 3 — Crecimiento (Mes 9-15)
```
▶ Préstamos preaprobados
▶ Ranking/score visible para el usuario
▶ Pago de servicios (ANDE, COPACO, recargas)
▶ Biometría (huella / FaceID)
▶ Referidos con beneficios
▶ App de gestión interna para agentes (CRM)
▶ Dashboard analytics para dirección
```

### FASE 4 — Escala (Mes 16-24)
```
▶ Billetera digital completa
▶ QR para pagos entre usuarios
▶ API abierta para aliados comerciales
▶ Microcréditos para PyMEs (montos mayores)
▶ Integración con sistema de pagos SIPAP BCP
▶ Machine Learning propio para scoring
▶ Expansión a otras ciudades/departamentos
```

---

## 4. ESTRATEGIA DE ADQUISICIÓN DE CLIENTES

```
CANALES DIGITALES (60% del presupuesto)
─────────────────────────────────────────
• Meta Ads (Facebook/Instagram): target 20-45 años, PY
• TikTok Ads: target 18-30 años, microemprendedores
• Google Search: keywords "préstamos rápidos paraguay"
• WhatsApp Business: atención y seguimiento de leads

CANALES DE ALIANZAS (25% del presupuesto)
──────────────────────────────────────────
• Alianza con minimarkets y kioscos (agentes)
• Convenios con empleadores (asalariados)
• Alianza con asociaciones de microempresarios
• Farmacias / ferreterías como puntos de pago

ORGÁNICO / VIRAL (15% del presupuesto)
────────────────────────────────────────
• Programa de referidos (Gs. 50.000 por referido exitoso)
• SEO blog sobre educación financiera en Paraguay
• Influencers locales micro (5K-50K seguidores)
• Boca a boca incentivado

CPL OBJETIVO: Gs. 30.000 - 50.000 por lead calificado
CPA OBJETIVO: Gs. 100.000 - 150.000 por crédito desembolsado
```

---

## 5. GESTIÓN DE RIESGO CREDITICIO

```
POLÍTICAS DE RIESGO — CREDI YUPI

CRITERIOS DE EXCLUSIÓN AUTOMÁTICA:
  ✗ Menor de 18 años
  ✗ Cédula no válida o vencida
  ✗ En lista negra SEPRELAD / OFAC
  ✗ Mora activa en Equifax > 60 días
  ✗ Más de 1 crédito activo (en fase inicial)
  ✗ Ratio cuota/ingreso > 40%

CRITERIOS DE APROBACIÓN BÁSICA:
  ✓ Cédula vigente validada en RNP
  ✓ Celular verificado con OTP
  ✓ KYC aprobado (foto + selfie)
  ✓ Ingreso declarado suficiente
  ✓ Score interno ≥ 500
  ✓ Referencia personal contactable

INDICADORES DE CALIDAD DE CARTERA:
  PAR 30 (mora >30 días): objetivo < 8%
  PAR 60 (mora >60 días): objetivo < 5%
  Tasa castigo anual:      objetivo < 3%

PROVISIONES CONTABLES:
  0-30 días mora:  1% del saldo
  31-60 días mora: 20% del saldo
  61-90 días mora: 50% del saldo
  > 90 días mora:  100% del saldo (castigo)
```

---

## 6. RECOMENDACIONES ESTRATÉGICAS CLAVE

### 6.1 Diferenciadores vs. Credi Ágil y competidores

```
QUÉ HACER DIFERENTE:

1. EDUCACIÓN FINANCIERA INTEGRADA
   → Mini-lecciones en la app sobre ahorro, crédito, presupuesto
   → Usuarios más educados = mejores pagadores

2. SCORE VISIBLE Y GAMIFICADO
   → Mostrar el score al usuario con medidor visual
   → "Sube tu score pagando a tiempo → mejor tasa"
   → Insignias y logros por buen comportamiento

3. COMUNIDAD DE MICROEMPRENDEDORES
   → Foro o chat de emprendedores dentro de la app
   → Networking entre usuarios → fidelización

4. TRANSPARENCIA TOTAL
   → Sin letra chica
   → Mostrar TODOS los costos antes de firmar
   → "¿Qué pasa si no pago?" explicado claramente

5. ATENCIÓN EN GUARANÍ
   → La app disponible en español Y guaraní
   → Diferenciador único en el mercado paraguayo
```

### 6.2 Regulación clave en Paraguay

```
MARCOS REGULATORIOS A CUMPLIR:

• BCP (Banco Central del Paraguay)
  - Si operás como IMEF: Resolución BCP N° 1/2021
  - Límite máximo de tasa: revisar circular vigente
  - Reporte periódico de cartera

• SEPRELAD
  - Prevención de lavado de activos
  - KYC obligatorio para todos los clientes
  - Reporte de operaciones sospechosas

• Ley 1682/01 — Datos Personales
  - Consentimiento explícito de uso de datos
  - Política de privacidad clara
  - Derecho al olvido

• Código Civil Paraguayo
  - Contratos electrónicos válidos
  - Firma electrónica reconocida (Ley 4610/12)

RECOMENDACIÓN: Contratar estudio jurídico especializado
en derecho financiero y tecnología en Paraguay desde el inicio.
```

### 6.3 Métricas clave a monitorear

```
KPIs DEL NEGOCIO (Dashboard ejecutivo)

ADQUISICIÓN:
  • Descargas de app (diario)
  • Usuarios registrados (diario)
  • Tasa de conversión registro → crédito (%)

CRÉDITO:
  • Solicitudes recibidas (diario)
  • Tasa de aprobación (%)
  • Monto promedio desembolsado (Gs.)
  • Tiempo promedio de aprobación (horas)

CARTERA:
  • Cartera total activa (Gs.)
  • PAR 30, PAR 60, PAR 90
  • Tasa de castigo (%)
  • Número de clientes activos

FINANCIERO:
  • Ingreso por intereses (mensual)
  • Costo de fondeo
  • Margen neto (spread)
  • EBITDA mensual

RETENCIÓN:
  • % clientes que solicitan segundo crédito
  • NPS (Net Promoter Score)
  • Churn rate mensual
```

---

## 7. STACK TECNOLÓGICO DETALLADO Y COSTOS

```
REPOSITORIO Y CI/CD
──────────────────────────────────────
GitHub (plan Team): USD 4/mes
GitHub Actions (CI/CD): Incluido

INFRAESTRUCTURA AWS (estimado mensual)
──────────────────────────────────────
EC2 t3.small (API server × 2):  USD 30/mes
RDS PostgreSQL t3.micro:        USD 25/mes
ElastiCache Redis t3.micro:     USD 15/mes
S3 (documentos KYC):            USD 5/mes
API Gateway:                    USD 10/mes
CloudFront (CDN):               USD 5/mes
Route53 (DNS):                  USD 1/mes
AWS Rekognition (OCR):          USD 1 por 1.000 imgs
─────────────────────────────────────
TOTAL AWS INICIAL:              ~USD 100/mes

SERVICIOS TERCEROS
──────────────────────────────────────
Firebase (FCM + Analytics):     Gratuito (hasta 10K MAU)
Twilio SMS:                     USD 0.0075 por SMS
Sentry (monitoring errores):    Gratuito (5K errores/mes)
Mixpanel (analytics):           Gratuito hasta 20M eventos

HERRAMIENTAS DE DESARROLLO
──────────────────────────────────────
Figma (diseño UI):              Gratuito
Expo (React Native):            Gratuito
Postman (testing API):          Gratuito
```

---

## 8. CHECKLIST DE LANZAMIENTO

```
PRE-LANZAMIENTO
═══════════════
□ Marco legal constituido
□ Registro BCP como IMEF (o alianza con entidad regulada)
□ Registro SEPRELAD
□ Póliza de seguro de responsabilidad civil
□ Fondeo inicial asegurado (mínimo USD 100K para cartera)
□ Contratos de KYC con RNP
□ API Equifax firmada
□ API Bancard firmada
□ Términos y condiciones revisados por abogado
□ Política de privacidad publicada
□ App auditada por seguridad (pentesting básico)
□ Play Store Developer Account
□ Apple Developer Account

LANZAMIENTO
═══════════
□ Beta privada con 50 usuarios (2 semanas)
□ Corrección de bugs críticos
□ Beta pública (Play Store Early Access)
□ App Store review aprobado
□ Campaña de lanzamiento en redes sociales
□ Cobertura en prensa paraguaya (ABC, Ultima Hora)
□ PR crisis plan listo

POST-LANZAMIENTO
════════════════
□ Monitoreo 24/7 primeros 30 días
□ Revisión semanal de métricas
□ Ajuste de scoring según comportamiento real
□ Iteración UI basada en feedback
□ Reunión mensual de riesgo crediticio
```
