# 🔐 Sistema KYC (Know Your Customer) - MANITO Platform

## 📋 Resumen

El sistema KYC de MANITO Platform permite a los profesionales verificar su identidad de manera segura y a los administradores revisar y aprobar estas verificaciones.

## 🎯 Características Implementadas

### ✅ Formulario de Verificación KYC
- **Multi-step form** con 6 pasos
- **Validación en tiempo real** con Zod
- **Carga de documentos** con Supabase Storage
- **Tipos de identificación** soportados:
  - Cédula de Identidad
  - Pasaporte
  - Licencia de Conducir

### ✅ Documentos Requeridos
1. **Documento de Identidad** (frente y reverso)
2. **Selfie** para verificación facial
3. **Récord Policial** o certificado de antecedentes
4. **Comprobante de Dirección** (opcional)

### ✅ Panel de Administración
- **Dashboard de estadísticas** KYC
- **Lista de verificaciones** pendientes
- **Revisión de documentos** con preview
- **Aprobación/Rechazo** con notas
- **Filtros** por estado

### ✅ Componentes de UI
- **KycStatus** - Estado de verificación del usuario
- **KycNotifications** - Notificaciones de estado
- **KycStats** - Estadísticas para admin
- **Formulario multi-step** con validación

## 🏗️ Arquitectura

### Base de Datos
```sql
-- Tabla principal de verificaciones KYC
CREATE TABLE kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  id_type VARCHAR NOT NULL,
  id_number VARCHAR NOT NULL,
  selfie_url TEXT NOT NULL,
  doc_front_url TEXT NOT NULL,
  doc_back_url TEXT,
  criminal_record_url TEXT NOT NULL,
  address_proof_url TEXT,
  status kyc_status DEFAULT 'PENDING_REVIEW',
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Buckets
- **kyc-documents** - Documentos de verificación (privado)
- **job-evidence** - Evidencias de trabajos (privado)
- **user-avatars** - Avatares de usuarios (público)

### Políticas RLS
- **Usuarios** pueden ver sus propias verificaciones
- **Administradores** pueden ver todas las verificaciones
- **Storage** protegido por políticas de acceso

## 🔧 Hooks y Utilidades

### useKyc Hook
```typescript
const {
  kycSubmission,
  isLoading,
  error,
  submitKyc,
  uploadFile,
  getKycStatus,
  isKycApproved,
  isKycPending,
  isKycRejected,
  canSubmitKyc
} = useKyc();
```

### Storage Utilities
```typescript
// Subir documento KYC
const url = await storage.kyc.uploadDocument(file, userId, 'docFront');

// Subir evidencia de trabajo
const url = await storage.jobEvidence.uploadEvidence(file, bookingId, 'before');

// Subir avatar
const url = await storage.avatars.uploadAvatar(file, userId);
```

## 📱 Flujo de Usuario

### 1. Profesional Inicia Verificación
1. Accede a `/kyc`
2. Completa formulario multi-step
3. Sube documentos requeridos
4. Envía verificación

### 2. Administrador Revisa
1. Accede a `/admin/kyc`
2. Ve lista de verificaciones pendientes
3. Revisa documentos
4. Aprueba o rechaza con notas

### 3. Notificaciones
1. Usuario recibe notificación de estado
2. Dashboard actualiza estado
3. Acceso a servicios según estado

## 🎨 Componentes UI

### KycStatus Component
```tsx
<KycStatus />
```
- Muestra estado actual de verificación
- Botones de acción según estado
- Información de documentos subidos

### KycNotifications Component
```tsx
<KycNotifications />
```
- Lista de notificaciones KYC
- Historial de cambios de estado
- Notas de administrador

### KycStats Component
```tsx
<KycStats />
```
- Estadísticas para administradores
- Contadores por estado
- Métricas de verificación

## 🔒 Seguridad

### Validación de Documentos
- **Tipos de archivo** permitidos: JPG, PNG, PDF
- **Tamaño máximo** de archivo: 10MB
- **Nombres únicos** para evitar conflictos
- **Políticas RLS** para acceso seguro

### Políticas de Acceso
- **Usuarios** solo pueden ver sus propias verificaciones
- **Administradores** pueden ver todas las verificaciones
- **Storage** protegido por políticas de bucket
- **Audit logs** para seguimiento de cambios

## 📊 Estados de Verificación

### Estados Posibles
- **PENDING_REVIEW** - Pendiente de revisión
- **APPROVED** - Aprobada
- **REJECTED** - Rechazada

### Transiciones
```
NOT_SUBMITTED → PENDING_REVIEW → APPROVED
                            ↓
                         REJECTED
```

## 🚀 Deploy y Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Configuración de Supabase
1. **Crear buckets** de storage
2. **Configurar políticas RLS**
3. **Ejecutar migraciones** de Prisma
4. **Configurar políticas** de storage

### Scripts de Setup
```bash
# Generar cliente Prisma
pnpm db:generate

# Sincronizar esquema
pnpm db:push

# Poblar con datos de prueba
pnpm db:seed
```

## 🧪 Testing

### Tests E2E
- **Flujo completo** de verificación
- **Validación** de formularios
- **Carga** de documentos
- **Revisión** administrativa

### Tests Unitarios
- **Hooks** de KYC
- **Utilidades** de storage
- **Validaciones** de formulario
- **Componentes** UI

## 📈 Métricas y Analytics

### Dashboard Admin
- **Total verificaciones**
- **Pendientes** de revisión
- **Aprobadas** vs rechazadas
- **Tiempo promedio** de revisión

### Dashboard Profesional
- **Estado** de verificación
- **Documentos** subidos
- **Notas** de administrador
- **Historial** de cambios

## 🔄 Próximos Pasos

### Mejoras Planificadas
1. **Verificación automática** con IA
2. **Integración** con servicios de identidad
3. **Notificaciones** push y email
4. **Analytics** avanzados
5. **Audit trail** completo

### Integraciones
- **Stripe Identity** para verificación
- **Jumio** para verificación de documentos
- **Twilio** para notificaciones SMS
- **SendGrid** para emails

---

## 🎉 ¡Sistema KYC Completado!

El sistema KYC de MANITO Platform está completamente implementado y listo para producción. Los profesionales pueden verificar su identidad de manera segura y los administradores pueden revisar y aprobar estas verificaciones de manera eficiente.

**Características principales:**
- ✅ Formulario multi-step con validación
- ✅ Carga segura de documentos
- ✅ Panel de administración completo
- ✅ Notificaciones en tiempo real
- ✅ Políticas de seguridad RLS
- ✅ Storage protegido
- ✅ Tests E2E completos

**¡MANITO Platform está listo para el siguiente nivel! 🚀**
