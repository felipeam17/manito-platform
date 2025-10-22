# 🚀 Guía de Deploy en Vercel

## Paso 1: Preparar el Repositorio

### 1.1 Crear repositorio en GitHub
```bash
# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: MANITO Platform MVP"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/manito-platform.git
git branch -M main
git push -u origin main
```

### 1.2 Configurar variables de entorno
Crear archivo `.env.local` con valores de prueba:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://manito-platform.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=es
TIMEZONE=America/Panama

# Supabase (usar proyecto de prueba)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url

# Stripe (usar claves de prueba)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id

# WhatsApp (opcional para MVP)
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Email (opcional para MVP)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@manito.com
```

## Paso 2: Deploy en Vercel

### 2.1 Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu cuenta de GitHub

### 2.2 Importar proyecto
1. Haz clic en "New Project"
2. Selecciona tu repositorio `manito-platform`
3. Vercel detectará automáticamente que es un monorepo

### 2.3 Configurar el proyecto
1. **Root Directory**: `apps/web`
2. **Framework Preset**: Next.js
3. **Build Command**: `pnpm build --filter=@manito/web`
4. **Output Directory**: `.next`
5. **Install Command**: `pnpm install`

### 2.4 Configurar variables de entorno
En el dashboard de Vercel, ve a Settings > Environment Variables y agrega:

```
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
DATABASE_URL=tu_database_url
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key
```

### 2.5 Deploy
1. Haz clic en "Deploy"
2. Espera a que se complete el build
3. Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

## Paso 3: Configurar Supabase

### 3.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la URL y las claves API

### 3.2 Configurar base de datos
```bash
# Instalar dependencias
pnpm install

# Generar cliente Prisma
pnpm db:generate

# Sincronizar esquema
pnpm db:push

# Poblar con datos de prueba
pnpm db:seed
```

### 3.3 Configurar RLS (Row Level Security)
Ejecuta estos comandos SQL en el editor de Supabase:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "Users can view public services" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Users can view their own bookings" ON bookings
  FOR ALL USING (auth.uid()::text = client_id OR auth.uid()::text = pro_id);
```

### 3.4 Crear buckets para archivos
```sql
-- Crear buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('kyc-documents', 'kyc-documents', false),
  ('job-evidence', 'job-evidence', false),
  ('user-avatars', 'user-avatars', true);
```

## Paso 4: Configurar Stripe (Opcional para MVP)

### 4.1 Crear cuenta en Stripe
1. Ve a [stripe.com](https://stripe.com)
2. Crea una cuenta de desarrollador
3. Obtén las claves API desde el dashboard

### 4.2 Configurar webhooks
1. Ve a Webhooks en tu dashboard de Stripe
2. Agrega el endpoint: `https://tu-proyecto.vercel.app/api/webhooks/stripe`
3. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`

## Paso 5: Verificar el Deploy

### 5.1 Probar la aplicación
1. Ve a tu URL de Vercel
2. Prueba la landing page
3. Prueba el registro de usuarios
4. Prueba el login
5. Verifica que los dashboards funcionen

### 5.2 Monitorear logs
1. Ve al dashboard de Vercel
2. Revisa los logs de build
3. Monitorea las funciones serverless

## 🎉 ¡Listo!

Tu aplicación MANITO estará disponible en:
- **URL**: `https://tu-proyecto.vercel.app`
- **Admin**: `https://tu-proyecto.vercel.app/admin`
- **Pro**: `https://tu-proyecto.vercel.app/pro`
- **Dashboard**: `https://tu-proyecto.vercel.app/dashboard`

## 🔧 Comandos Útiles

```bash
# Deploy local
pnpm dev

# Build local
pnpm build

# Linting
pnpm lint

# Tests
pnpm test
pnpm test:e2e

# Base de datos
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## 📞 Soporte

Si tienes problemas con el deploy:

1. Revisa los logs de Vercel
2. Verifica las variables de entorno
3. Asegúrate de que Supabase esté configurado
4. Consulta la documentación de Vercel

---

**¡MANITO Platform está listo para el mundo! 🚀**
