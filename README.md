# MANITO - Marketplace de Oficios

MANITO es una plataforma "Tinder para oficios" que conecta clientes con profesionales verificados para servicios como plomería, electricidad, pintura, jardinería y limpieza.

## 🚀 Características Principales

### Para Clientes
- **Búsqueda inteligente** por servicio y ubicación
- **Profesionales verificados** con proceso KYC riguroso
- **Pagos seguros** con Stripe
- **Calificaciones y reseñas** para garantizar calidad
- **Bot de WhatsApp** para solicitar servicios

### Para Profesionales
- **Backoffice completo** con calendario, inventario y finanzas
- **Gestión de servicios** y precios
- **Wallet integrado** con Stripe Connect
- **Sistema de comisiones** configurables
- **Verificación KYC** para generar confianza

### Para Administradores
- **Panel de control** para gestión de KYC
- **Reportes y analytics** del negocio
- **Gestión de disputas** y arbitraje
- **Configuración de comisiones** por categoría

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Next.js API routes + Server Actions
- **Base de Datos**: PostgreSQL en Supabase + Prisma ORM
- **Autenticación**: Supabase Auth con OAuth
- **Pagos**: Stripe (Payments + Connect)
- **Mensajería**: WhatsApp Cloud API + Resend (emails)
- **Storage**: Supabase buckets
- **Realtime**: Supabase Realtime
- **Monorepo**: Turbo + pnpm

## 📁 Estructura del Proyecto

```
manito-platform/
├── apps/
│   └── web/                 # Aplicación Next.js principal
├── packages/
│   ├── ui/                  # Componentes UI compartidos
│   ├── db/                  # Configuración de Prisma
│   └── config/              # Configuraciones compartidas
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
├── scripts/                 # Scripts de utilidad
└── docs/                    # Documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- pnpm 8+
- Cuenta de Supabase
- Cuenta de Stripe
- Cuenta de WhatsApp Business API

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd manito-platform
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Configurar base de datos**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                    # Ejecutar en modo desarrollo
pnpm build                  # Construir para producción
pnpm start                  # Ejecutar en producción

# Base de datos
pnpm db:generate           # Generar cliente Prisma
pnpm db:push               # Sincronizar esquema con DB
pnpm db:migrate            # Ejecutar migraciones
pnpm db:seed               # Poblar base de datos

# Testing
pnpm test                  # Ejecutar tests unitarios
pnpm test:e2e              # Ejecutar tests e2e

# Linting
pnpm lint                  # Ejecutar ESLint
pnpm format                # Formatear código con Prettier
```

## 🔐 Variables de Entorno

### Requeridas

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=es
TIMEZONE=America/Panama

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id

# WhatsApp
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Email
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@manito.com
```

## 📊 Modelo de Datos

### Entidades Principales

- **User**: Usuarios (CLIENT, PRO, ADMIN)
- **Category**: Categorías de servicios
- **Service**: Servicios ofrecidos por profesionales
- **Booking**: Reservas/citas
- **Review**: Reseñas y calificaciones
- **KycSubmission**: Verificaciones KYC
- **InventoryItem**: Inventario de materiales
- **Commission**: Comisiones por categoría

### Estados de Booking

- `PENDING`: Pendiente de confirmación
- `CONFIRMED`: Confirmado por el profesional
- `IN_PROGRESS`: En progreso
- `COMPLETED`: Completado
- `CANCELED`: Cancelado
- `DISPUTED`: En disputa

## 🔄 Flujos Principales

### Registro de Cliente
1. Formulario multi-paso con validación
2. Verificación de email y teléfono
3. Aceptación de términos y condiciones

### Registro de Profesional
1. Formulario de datos personales
2. Información fiscal y de servicios
3. Proceso KYC (documentos + selfie)
4. Aprobación por administrador

### Proceso de Reserva
1. Búsqueda de servicios
2. Selección de profesional
3. Agendamiento de cita
4. Pago seguro con Stripe
5. Confirmación y seguimiento

### Bot de WhatsApp
1. Usuario envía mensaje con servicio requerido
2. Bot procesa intención con NLU básico
3. Sugiere profesionales disponibles
4. Genera link de pago
5. Confirma reserva

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Supabase

1. Crear proyecto en Supabase
2. Configurar RLS (Row Level Security)
3. Crear buckets para archivos
4. Configurar webhooks

## 📱 PWA

La aplicación está configurada como PWA con:
- Service Worker para cache offline
- Manifest para instalación
- Notificaciones push
- Funcionalidad offline básica

## 🔒 Seguridad

- **RBAC**: Control de acceso basado en roles
- **KYC**: Verificación de identidad obligatoria
- **Rate Limiting**: Protección contra abuso
- **Audit Logs**: Registro de acciones importantes
- **CSRF Protection**: Protección en formularios

## 📈 Monitoreo

- **Analytics**: Métricas de uso y conversión
- **Error Tracking**: Monitoreo de errores
- **Performance**: Métricas de rendimiento
- **Uptime**: Monitoreo de disponibilidad

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@manito.com
- **WhatsApp**: +507 1234-5678
- **Documentación**: [docs.manito.com](https://docs.manito.com)

---

**MANITO** - Conectando profesionales con clientes de confianza 🤝
