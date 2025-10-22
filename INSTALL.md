# 🚀 Instalación de MANITO Platform

Esta guía te ayudará a configurar y ejecutar MANITO en tu entorno local.

## 📋 Prerrequisitos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **pnpm 8+** - Instalar con `npm install -g pnpm`
- **Git** - Para clonar el repositorio
- **Cuenta de Supabase** - Para base de datos y autenticación
- **Cuenta de Stripe** - Para pagos
- **Cuenta de WhatsApp Business API** - Para el bot (opcional)

## 🔧 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd manito-platform
```

### 2. Ejecutar Script de Configuración

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Este script automáticamente:
- Instala todas las dependencias
- Crea el archivo `.env.local`
- Genera el cliente de Prisma
- Configura la base de datos (si está configurada)

### 3. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus credenciales:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=es
TIMEZONE=America/Panama

# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url

# Stripe (REQUERIDO)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id

# WhatsApp (OPCIONAL)
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Email (OPCIONAL)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@manito.com
```

### 4. Configurar Base de Datos

```bash
# Sincronizar esquema con la base de datos
pnpm db:push

# Poblar con datos de prueba
pnpm db:seed
```

### 5. Ejecutar en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la URL y las claves API

### 2. Configurar RLS (Row Level Security)

Ejecuta estos comandos SQL en el editor de Supabase:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "Users can view public services" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Users can view their own bookings" ON bookings
  FOR ALL USING (auth.uid()::text = client_id OR auth.uid()::text = pro_id);
```

### 3. Crear Buckets para Archivos

```sql
-- Crear buckets para KYC y evidencias
INSERT INTO storage.buckets (id, name, public) VALUES
  ('kyc-documents', 'kyc-documents', false),
  ('job-evidence', 'job-evidence', false),
  ('user-avatars', 'user-avatars', true);
```

## 💳 Configuración de Stripe

### 1. Crear Cuenta Stripe

1. Ve a [stripe.com](https://stripe.com)
2. Crea una cuenta de desarrollador
3. Obtén las claves API desde el dashboard

### 2. Configurar Stripe Connect

1. Habilita Stripe Connect en tu dashboard
2. Configura las URLs de callback:
   - Success: `http://localhost:3000/auth/stripe/success`
   - Cancel: `http://localhost:3000/auth/stripe/cancel`

### 3. Configurar Webhooks

1. Ve a Webhooks en tu dashboard de Stripe
2. Agrega el endpoint: `http://localhost:3000/api/webhooks/stripe`
3. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`

## 📱 Configuración de WhatsApp (Opcional)

### 1. Configurar WhatsApp Business API

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una aplicación
3. Configura WhatsApp Business API
4. Obtén el token de acceso y ID del número de teléfono

### 2. Configurar Webhook

1. Configura la URL del webhook: `http://localhost:3000/api/webhooks/whatsapp`
2. Verifica el token que configuraste en `.env.local`

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
pnpm test
```

### Ejecutar Tests E2E

```bash
pnpm test:e2e
```

### Ejecutar Linting

```bash
pnpm lint
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. El deploy se ejecutará automáticamente

### Docker

```bash
# Construir imagen
docker build -t manito-platform .

# Ejecutar con Docker Compose
docker-compose up -d
```

## 🐛 Solución de Problemas

### Error: "Module not found"

```bash
# Limpiar cache y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"

1. Verifica que `DATABASE_URL` esté correctamente configurado
2. Asegúrate de que la base de datos de Supabase esté ejecutándose
3. Verifica que las credenciales sean correctas

### Error: "Stripe webhook signature invalid"

1. Verifica que `STRIPE_WEBHOOK_SECRET` esté correctamente configurado
2. Asegúrate de que la URL del webhook sea accesible públicamente
3. Para desarrollo local, usa ngrok para exponer tu servidor

## 📞 Soporte

Si tienes problemas con la instalación:

1. Revisa los logs de error
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que todos los servicios externos estén funcionando
4. Consulta la documentación de cada servicio (Supabase, Stripe, etc.)

## 🎉 ¡Listo!

Una vez completada la instalación, tendrás:

- ✅ Landing page funcional
- ✅ Sistema de autenticación
- ✅ Base de datos configurada
- ✅ Datos de prueba cargados
- ✅ Tests configurados
- ✅ Deploy listo

¡Disfruta construyendo con MANITO! 🚀
