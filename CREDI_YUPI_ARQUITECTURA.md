# 🏗️ CREDI YUPI — ARQUITECTURA COMPLETA DE LA APP
> App de Microcréditos Digitales para Paraguay
> Versión 1.0 | Mayo 2026

---

## 1. VISIÓN GENERAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                        CREDI YUPI                           │
│              App de Microcréditos Digitales                 │
│                                                             │
│   "Dinero rápido, en tus manos, sin complicaciones"        │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa         | Tecnología            | Justificación                              |
|--------------|-----------------------|--------------------------------------------|
| Frontend     | React Native 0.73+    | Cross-platform iOS/Android, una sola base  |
| Backend      | Node.js + Express     | Alta concurrencia, ecosistema amplio        |
| Base de datos| PostgreSQL 16         | ACID compliance crítico para datos financieros |
| Cache        | Redis                 | Sesiones, rate limiting, scoring temporal  |
| Cloud        | AWS (SA-EAST-1 São Paulo) | Más cercano a Paraguay, bajo latencia  |
| Auth         | JWT + AWS Cognito     | MFA, biometría, gestión de sesiones         |
| Push         | Firebase Cloud Messaging | Notificaciones push iOS/Android         |
| Archivos     | AWS S3                | Almacenamiento de documentos KYC           |
| Scoring      | API interna + Equifax PY | Evaluación crediticia automatizada      |
| Pagos        | Bancard API (PY)      | Pagos locales, red de cobranza             |

---

## 2. ARQUITECTURA DE ALTO NIVEL

```
                    ┌─────────────────────┐
                    │   CLIENTE MÓVIL     │
                    │  (React Native)     │
                    │                     │
                    │  iOS  │  Android    │
                    └────────┬────────────┘
                             │ HTTPS / REST + WebSocket
                             │
                    ┌────────▼────────────┐
                    │   API GATEWAY       │
                    │  (AWS API Gateway)  │
                    │  Rate Limiting      │
                    │  Auth Middleware    │
                    └────────┬────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
   │  AUTH       │  │  CORE API    │  │  NOTIF.      │
   │  SERVICE    │  │  SERVICE     │  │  SERVICE     │
   │             │  │              │  │              │
   │ - Registro  │  │ - Créditos   │  │ - Push (FCM) │
   │ - Login     │  │ - Scoring    │  │ - SMS        │
   │ - KYC       │  │ - Pagos      │  │ - Email      │
   └──────┬──────┘  └───────┬──────┘  └──────────────┘
          │                 │
   ┌──────▼─────────────────▼──────┐
   │         POSTGRESQL             │
   │     (Base de Datos Principal)  │
   │                                │
   │  usuarios | creditos | pagos   │
   │  scoring | documentos | logs   │
   └────────────────────────────────┘
          │
   ┌──────▼──────────────────────┐
   │     SERVICIOS EXTERNOS       │
   │                              │
   │  Equifax PY (scoring)        │
   │  Bancard (pagos)             │
   │  AWS Rekognition (OCR CI)    │
   │  Twilio (SMS OTP)            │
   └─────────────────────────────┘
```

---

## 3. MICROSERVICIOS Y MÓDULOS

### 3.1 Auth Service
```
/auth
  ├── POST /register          → Registro nuevo usuario
  ├── POST /login             → Login con email/cédula + PIN
  ├── POST /verify-otp        → Verificación OTP por SMS
  ├── POST /refresh-token     → Renovar JWT
  ├── POST /biometric-login   → Login con huella/Face ID
  └── DELETE /logout          → Cerrar sesión
```

### 3.2 KYC Service (Know Your Customer)
```
/kyc
  ├── POST /upload-cedula     → Subir foto cédula anverso/reverso
  ├── POST /selfie            → Foto liveness check
  ├── GET  /status            → Estado de verificación KYC
  └── POST /validate-rnp      → Validar cédula en RNP Paraguay
```

### 3.3 Credit Service
```
/creditos
  ├── POST /simular           → Simular crédito (monto, plazo, tasa)
  ├── POST /solicitar         → Nueva solicitud de crédito
  ├── GET  /solicitudes       → Listar solicitudes del usuario
  ├── GET  /solicitudes/:id   → Detalle de solicitud
  ├── GET  /activos           → Créditos activos
  ├── GET  /historial         → Historial completo
  ├── GET  /amortizacion/:id  → Tabla de amortización
  └── GET  /preaprobado       → Verificar oferta preaprobada
```

### 3.4 Payment Service
```
/pagos
  ├── POST /realizar          → Registrar pago de cuota
  ├── GET  /cuotas-pendientes → Cuotas por vencer
  ├── GET  /historial         → Historial de pagos
  └── POST /pago-automatico   → Activar débito automático
```

### 3.5 Scoring Service
```
/scoring
  ├── POST /evaluar           → Ejecutar scoring automático
  ├── GET  /score/:userId     → Score actual del usuario
  └── GET  /historial/:userId → Evolución del score
```

---

## 4. FLUJO DE USUARIO COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO PRINCIPAL                          │
└─────────────────────────────────────────────────────────────┘

PASO 1: DESCUBRIMIENTO
  App Store / Google Play
        │
        ▼
  Pantalla de bienvenida
  (animación logo Credi Yupi)
        │
        ▼
  ¿Tenés cuenta? → [SÍ] → Login → Dashboard
                 → [NO] → Registro →

PASO 2: REGISTRO (3 minutos)
  ①  Número de cédula paraguaya
  ②  Nombre completo (auto-completado desde RNP)
  ③  Número de celular → OTP SMS
  ④  Email
  ⑤  PIN de 6 dígitos
  ⑥  Aceptar Términos y Condiciones
        │
        ▼
  KYC BÁSICO:
  ①  Foto cédula anverso
  ②  Foto cédula reverso
  ③  Selfie (liveness check)
        │
        ▼
  ✅ Cuenta creada → Dashboard

PASO 3: SIMULADOR
  Deslizar monto (slider)     Gs. 500.000 → 15.000.000
  Seleccionar plazo           6 / 12 / 18 / 24 meses
        │
        ▼
  Resultado instantáneo:
  ┌──────────────────────┐
  │ Cuota mensual: Gs. X │
  │ Tasa: 28% anual      │
  │ Total a pagar: Gs. X │
  │ Ver tabla completa   │
  └──────────────────────┘
        │
        ▼
  [SOLICITAR ESTE CRÉDITO]

PASO 4: SOLICITUD
  ①  Propósito del crédito (lista desplegable)
  ②  Tipo de ingreso (asalariado / emprendedor)
  ③  Ingreso mensual declarado (Gs.)
  ④  Lugar de trabajo / negocio
  ⑤  Referencia personal (nombre + celular)
        │
        ▼
  SCORING AUTOMÁTICO (10-30 segundos)
  ┌─────────────────────────────┐
  │ ⏳ Evaluando tu solicitud... │
  │   Analizando perfil         │
  │   Verificando historial     │
  │   Calculando oferta         │
  └─────────────────────────────┘
        │
     ┌──┴──┐
     │     │
   APR.  RECHAZ.
     │     │
     ▼     ▼
  Oferta  Motivo + mejorar
  crédito perfil para futuro

PASO 5: APROBACIÓN Y DESEMBOLSO
  ①  Ver oferta final (puede diferir de lo solicitado)
  ②  Aceptar contrato digital (firma electrónica)
  ③  Ingresar cuenta bancaria / billetera electrónica
  ④  Desembolso en menos de 24h (laborables)
        │
        ▼
  💰 ¡Dinero en tu cuenta!
  Notificación push + SMS

PASO 6: GESTIÓN CONTINUA
  → Ver cuotas pendientes
  → Pagar desde la app
  → Ver tabla de amortización
  → Solicitar nuevo crédito (si cumple criterios)
```

---

## 5. PANTALLAS PRINCIPALES (WIREFRAMES DETALLADOS)

### 5.1 Splash Screen
```
┌────────────────────┐
│                    │
│                    │
│    🟡 CREDI YUPI   │
│    ─────────────   │
│   Tu préstamo      │
│   en minutos       │
│                    │
│   [████████  85%]  │
│   Cargando...      │
│                    │
└────────────────────┘
```

### 5.2 Onboarding (3 slides)
```
Slide 1             Slide 2             Slide 3
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  🚀          │   │  📱          │   │  ⚡          │
│  Rápido      │   │  Todo desde  │   │  Dinero en   │
│  y fácil     │   │  tu celular  │   │  24 horas    │
│              │   │              │   │              │
│ Sin trámites │   │ Sin salir    │   │ Sin colas    │
│ en papel     │   │ de casa      │   │ ni esperas   │
│              │   │              │   │              │
│  ● ○ ○      │   │  ○ ● ○      │   │  ○ ○ ●      │
│  [Siguiente] │   │  [Siguiente] │   │  [Empezar]   │
└──────────────┘   └──────────────┘   └──────────────┘
```

### 5.3 Dashboard Principal
```
┌─────────────────────────┐
│ 👋 Hola, Juan!    🔔 2 │
│ ─────────────────────── │
│  SCORE CREDITICIO       │
│  ┌──────────────────┐   │
│  │   🟢 750 / 1000  │   │
│  │   EXCELENTE      │   │
│  └──────────────────┘   │
│                         │
│  CRÉDITO ACTIVO         │
│  ┌──────────────────┐   │
│  │ Gs. 5.000.000    │   │
│  │ Cuota: Gs. 285K  │   │
│  │ Vence: 15/06/26  │   │
│  │ [VER DETALLES]   │   │
│  └──────────────────┘   │
│                         │
│  ┌───────┐  ┌────────┐  │
│  │ 💰    │  │ 📊     │  │
│  │Simular│  │Historial│  │
│  └───────┘  └────────┘  │
│  ┌───────┐  ┌────────┐  │
│  │ 💳    │  │ 👤     │  │
│  │ Pagar │  │ Perfil │  │
│  └───────┘  └────────┘  │
└─────────────────────────┘
```

### 5.4 Simulador de Crédito
```
┌─────────────────────────┐
│ ← SIMULAR CRÉDITO       │
│ ─────────────────────── │
│  ¿Cuánto necesitás?     │
│                         │
│  Gs. 3.000.000          │
│  ●────────────○         │
│  500K         15M       │
│                         │
│  ¿A cuántos meses?      │
│  ┌────┐┌────┐┌────┐┌────┐│
│  │ 6  ││12  ││18  ││24  ││
│  └────┘└────┘└────┘└────┘│
│       [■■■■]            │
│                         │
│ ┌───────────────────────┐│
│ │ CUOTA MENSUAL         ││
│ │ Gs. 170.583           ││
│ │                       ││
│ │ Tasa: 28% anual       ││
│ │ Total: Gs. 3.411.660  ││
│ │ Costo financiero:     ││
│ │ Gs. 411.660           ││
│ └───────────────────────┘│
│                         │
│ [Ver tabla completa]    │
│                         │
│ [SOLICITAR AHORA] 🚀   │
└─────────────────────────┘
```

### 5.5 Tabla de Amortización
```
┌─────────────────────────┐
│ ← PLAN DE PAGOS         │
│ Gs. 3.000.000 / 24m     │
│ ─────────────────────── │
│ Cuota│Capital│Interés│Saldo│
│──────┼───────┼───────┼─────│
│  1   │ 100K  │  70K  │2.9M │
│  2   │ 102K  │  68K  │2.8M │
│  3   │ 104K  │  66K  │2.7M │
│  ...  ...     ...    ...   │
│  24  │ 169K  │   1K  │  0  │
│ ─────────────────────── │
│ TOTAL CAPITAL: 3.000.000│
│ TOTAL INTERÉS:   411.660│
│ TOTAL PAGADO:  3.411.660│
│                         │
│ [Descargar PDF]         │
└─────────────────────────┘
```

### 5.6 Estado de Solicitud
```
┌─────────────────────────┐
│ ← MI SOLICITUD          │
│ #SOL-2026-004521        │
│ ─────────────────────── │
│  ✅ Solicitud enviada   │
│  │                      │
│  ✅ Documentos OK       │
│  │                      │
│  ⏳ Evaluación          │
│  │  (en proceso)        │
│  │                      │
│  ○  Aprobación          │
│  │                      │
│  ○  Desembolso          │
│                         │
│ Tiempo estimado:        │
│ ~2 horas hábiles        │
│                         │
│ [📞 Contactar soporte]  │
└─────────────────────────┘
```

---

## 6. PALETA DE COLORES Y DISEÑO

```
IDENTIDAD VISUAL CREDI YUPI
────────────────────────────

Primario:    #FFD700  (Amarillo Yupi - energía, confianza)
Secundario:  #1A56DB  (Azul Digital - profesionalismo)
Acento:      #16A34A  (Verde Éxito - aprobación, dinero)
Alerta:      #DC2626  (Rojo Error - rechazo, mora)
Fondo:       #F8FAFC  (Blanco Hielo)
Texto:       #1E293B  (Gris Oscuro)

TIPOGRAFÍA
──────────
Display:   Poppins Bold
Cuerpo:    Inter Regular/Medium
Monoesp.:  Roboto Mono (para montos)

FILOSOFÍA DE DISEÑO
────────────────────
- Cards redondeadas (border-radius: 16px)
- Sombras suaves (shadow elevation 2-4)
- Iconos: Lucide Icons
- Animaciones: Lottie (celebración aprobación)
- Gradientes en botones CTA
```

---

## 7. ESTRUCTURA DE BASE DE DATOS

### 7.1 Diagrama ERD (texto)

```
USUARIOS ──────── SOLICITUDES_CREDITO
    │                     │
    │                     │
    ├── DOCUMENTOS_KYC    ├── AMORTIZACION_CUOTAS
    │                     │
    ├── SCORES            └── PAGOS_REALIZADOS
    │
    └── NOTIFICACIONES
```

### 7.2 Tablas SQL Completas

```sql
-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cedula            VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo   VARCHAR(200) NOT NULL,
    email             VARCHAR(150) UNIQUE,
    celular           VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento  DATE,
    pin_hash          VARCHAR(255) NOT NULL,
    biometria_habilitada BOOLEAN DEFAULT FALSE,
    kyc_status        VARCHAR(20) DEFAULT 'PENDIENTE'
                      CHECK (kyc_status IN ('PENDIENTE','APROBADO','RECHAZADO')),
    estado            VARCHAR(20) DEFAULT 'ACTIVO'
                      CHECK (estado IN ('ACTIVO','BLOQUEADO','INACTIVO')),
    score_interno     INTEGER DEFAULT 500,
    limite_credito    NUMERIC(15,2) DEFAULT 0,
    prestamo_preaprobado NUMERIC(15,2),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: documentos_kyc
-- ============================================================
CREATE TABLE documentos_kyc (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            VARCHAR(50) NOT NULL
                    CHECK (tipo IN ('CEDULA_ANVERSO','CEDULA_REVERSO','SELFIE','COMPROBANTE_INGRESO')),
    url_s3          VARCHAR(500) NOT NULL,
    estado_ocr      VARCHAR(20) DEFAULT 'PENDIENTE',
    datos_extraidos JSONB,
    revisado_por    UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: scoring_historial
-- ============================================================
CREATE TABLE scoring_historial (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID REFERENCES usuarios(id),
    score_valor     INTEGER NOT NULL,
    score_externo   INTEGER,    -- Equifax
    factores        JSONB,      -- {historial_pago: 0.85, deuda_actual: 0.60, ...}
    fuente          VARCHAR(50), -- 'INTERNO', 'EQUIFAX', 'COMBINADO'
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: solicitudes_credito
-- ============================================================
CREATE TABLE solicitudes_credito (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_solicitud    VARCHAR(30) UNIQUE NOT NULL, -- SOL-2026-004521
    usuario_id          UUID REFERENCES usuarios(id),
    monto_solicitado    NUMERIC(15,2) NOT NULL,
    monto_aprobado      NUMERIC(15,2),
    plazo_meses         INTEGER NOT NULL,
    tasa_anual          NUMERIC(5,4) NOT NULL,       -- 0.28 = 28%
    tasa_mensual        NUMERIC(7,6) NOT NULL,       -- 0.023333...
    cuota_mensual       NUMERIC(15,2),
    proposito           VARCHAR(100),
    tipo_ingreso        VARCHAR(30)
                        CHECK (tipo_ingreso IN ('ASALARIADO','EMPRENDEDOR','OTRO')),
    ingreso_declarado   NUMERIC(15,2),
    empleador           VARCHAR(200),
    referencia_nombre   VARCHAR(200),
    referencia_celular  VARCHAR(20),
    score_al_solicitar  INTEGER,
    estado              VARCHAR(30) DEFAULT 'PENDIENTE'
                        CHECK (estado IN (
                            'PENDIENTE','EN_EVALUACION','APROBADA',
                            'RECHAZADA','DESEMBOLSADA','CANCELADA'
                        )),
    motivo_rechazo      TEXT,
    fecha_aprobacion    TIMESTAMP WITH TIME ZONE,
    fecha_desembolso    TIMESTAMP WITH TIME ZONE,
    cuenta_desembolso   VARCHAR(50),
    banco_desembolso    VARCHAR(100),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: creditos_activos
-- ============================================================
CREATE TABLE creditos_activos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id        UUID REFERENCES solicitudes_credito(id),
    usuario_id          UUID REFERENCES usuarios(id),
    monto_original      NUMERIC(15,2) NOT NULL,
    saldo_pendiente     NUMERIC(15,2) NOT NULL,
    cuotas_totales      INTEGER NOT NULL,
    cuotas_pagadas      INTEGER DEFAULT 0,
    cuotas_vencidas     INTEGER DEFAULT 0,
    proxima_cuota_fecha DATE NOT NULL,
    proxima_cuota_monto NUMERIC(15,2) NOT NULL,
    dias_mora           INTEGER DEFAULT 0,
    estado              VARCHAR(20) DEFAULT 'AL_DIA'
                        CHECK (estado IN ('AL_DIA','EN_MORA','CANCELADO','CASTIGADO')),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: tabla_amortizacion
-- ============================================================
CREATE TABLE tabla_amortizacion (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credito_id      UUID REFERENCES creditos_activos(id) ON DELETE CASCADE,
    numero_cuota    INTEGER NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cuota_total     NUMERIC(15,2) NOT NULL,
    interes         NUMERIC(15,2) NOT NULL,
    capital         NUMERIC(15,2) NOT NULL,
    saldo_restante  NUMERIC(15,2) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'PENDIENTE'
                    CHECK (estado IN ('PENDIENTE','PAGADA','VENCIDA','PAGADA_CON_MORA')),
    fecha_pago_real DATE,
    monto_pagado    NUMERIC(15,2),
    interes_mora    NUMERIC(15,2) DEFAULT 0,
    UNIQUE(credito_id, numero_cuota)
);

-- ============================================================
-- TABLA: pagos_realizados
-- ============================================================
CREATE TABLE pagos_realizados (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credito_id      UUID REFERENCES creditos_activos(id),
    usuario_id      UUID REFERENCES usuarios(id),
    cuota_numero    INTEGER NOT NULL,
    monto_capital   NUMERIC(15,2) NOT NULL,
    monto_interes   NUMERIC(15,2) NOT NULL,
    monto_mora      NUMERIC(15,2) DEFAULT 0,
    monto_total     NUMERIC(15,2) NOT NULL,
    metodo_pago     VARCHAR(50),  -- 'BANCARD','TRANSFER','EFECTIVO'
    referencia_pago VARCHAR(100),
    fecha_pago      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLA: notificaciones
-- ============================================================
CREATE TABLE notificaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID REFERENCES usuarios(id),
    tipo            VARCHAR(50), -- 'PAGO_VENCE','APROBACION','MORA','PROMO'
    titulo          VARCHAR(200),
    mensaje         TEXT,
    leida           BOOLEAN DEFAULT FALSE,
    enviada_push    BOOLEAN DEFAULT FALSE,
    enviada_sms     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_solicitudes_usuario ON solicitudes_credito(usuario_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_credito(estado);
CREATE INDEX idx_amortizacion_credito ON tabla_amortizacion(credito_id);
CREATE INDEX idx_amortizacion_vencimiento ON tabla_amortizacion(fecha_vencimiento);
CREATE INDEX idx_pagos_credito ON pagos_realizados(credito_id);
CREATE INDEX idx_notif_usuario ON notificaciones(usuario_id, leida);
```

---

## 8. LÓGICA DE SCORING CREDITICIO

```
FACTORES DE SCORING INTERNO (1000 puntos máx.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Factor                        Peso   Puntos Máx.
─────────────────────────────────────────────────
Historial de pagos internos   35%       350
Nivel de endeudamiento        25%       250
Score Equifax (si disponible) 20%       200
Antigüedad en Credi Yupi      10%       100
Ingreso vs. cuota (ratio)     10%       100
─────────────────────────────────────────────────
TOTAL                        100%      1000

DECISIÓN AUTOMÁTICA:
  ≥ 700 → APROBADO (mejor tasa, mayor monto)
  600-699 → APROBADO CONDICIONAL (tasa estándar)
  500-599 → APROBADO LIMITADO (menor monto, más plazo)
  < 500   → RECHAZADO (sugerencias de mejora)

RATIO DEUDA/INGRESO:
  Cuota mensual ≤ 30% del ingreso declarado → VERDE
  Cuota mensual 31-40% del ingreso         → AMARILLO
  Cuota mensual > 40% del ingreso          → RECHAZADO
```

---

## 9. SEGURIDAD Y CUMPLIMIENTO

```
CAPA DE SEGURIDAD
─────────────────

1. TRANSPORTE
   - TLS 1.3 en todas las comunicaciones
   - Certificate Pinning en la app móvil
   - HSTS headers

2. AUTENTICACIÓN
   - PIN de 6 dígitos (hash bcrypt rounds=12)
   - JWT con expiración de 15 minutos
   - Refresh token en storage seguro del dispositivo
   - Bloqueo tras 5 intentos fallidos
   - Biometría (TouchID/FaceID) como 2do factor

3. DATOS EN REPOSO
   - PostgreSQL con cifrado de columnas sensibles (pgcrypto)
   - Campos cifrados: cedula, celular, datos bancarios
   - S3 con Server-Side Encryption (AES-256)

4. CUMPLIMIENTO PARAGUAY
   - Ley N° 1682/01 (protección de datos personales)
   - Resolución BCP sobre operadores financieros no bancarios
   - Registro en SEPRELAD (prevención lavado de dinero)
   - Consentimiento explícito de uso de datos

5. ANTI-FRAUDE
   - Device fingerprinting
   - Detección de múltiples cuentas por cédula
   - Análisis de comportamiento (velocidad de formularios)
   - Blacklist de cédulas comprometidas
```

---

## 10. INTEGRACIÓN CON SERVICIOS EXTERNOS

```
SERVICIOS A INTEGRAR EN PARAGUAY

1. BANCARD
   - Red de cajeros y comercios afiliados
   - API para cobros y pagos
   - QR para pagos presenciales

2. EQUIFAX PARAGUAY
   - Bureau de crédito
   - Historial crediticio del solicitante
   - Score crediticio externo

3. REGISTROS PÚBLICOS (RNP)
   - Validación de cédula de identidad
   - Datos biográficos del titular

4. TELEFONÍA
   - Twilio / SMSParaguay para OTP
   - Integración con Tigo Money / Billetera Personal
   - Personal / Claro / Tigo para validación de línea

5. FISCALÍA / SEPRELAD
   - PEP Check (Personas Políticamente Expuestas)
   - Lista de sancionados
```

---

## 11. ARQUITECTURA DE NOTIFICACIONES

```
MOTOR DE NOTIFICACIONES
────────────────────────

Trigger              → Canal           → Mensaje
─────────────────────────────────────────────────
Cuota vence en 5d    → Push + SMS     → "Tu cuota vence el DD/MM..."
Cuota vence en 1d    → Push + SMS     → "¡Mañana vence tu cuota!"
Cuota vencida        → Push + SMS + E → "Tu cuota está vencida..."
Solicitud aprobada   → Push + SMS     → "¡Felicitaciones! Tu crédito..."
Desembolso realizado → Push + SMS     → "Ya tenés Gs. X en tu cuenta"
Pago registrado      → Push           → "Pago de cuota confirmado ✅"
Préstamo preaprobado → Push           → "¡Tenés una oferta especial!"
Mora 30+ días        → Push + SMS + E → Recordatorio urgente + interés

HORARIOS PERMITIDOS:
  SMS/Push: 08:00 - 20:00 (horario Paraguay)
  Máximo 2 notificaciones push / día / usuario
```
