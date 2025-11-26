# 🚀 Guía de Despliegue en Vercel

## Requisitos Previos

✅ Tener una cuenta en [Vercel](https://vercel.com)
✅ Tener tu proyecto en un repositorio Git (GitHub, GitLab, o Bitbucket)
✅ Tener configurado Supabase y las variables de entorno

---

## Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir tu proyecto a GitHub

Si aún no lo has hecho:

```bash
# Inicializar git (si no está inicializado)
git init

# Crear archivo .gitignore si no existe
echo "node_modules
dist
.env
.env.local" > .gitignore

# Hacer commit de tus archivos
git add .
git commit -m "Initial commit - Planificador de Turnos"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

### Paso 2: Importar proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New"** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel:

1. Ve a la sección **"Environment Variables"**
2. Agrega las siguientes variables:

```
VITE_SUPABASE_URL=https://lojcxoxwbxhzldfwlrqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvamN4b3h3YnhoemxkZndscnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjA5NDEsImV4cCI6MjA3OTczNjk0MX0.Q1bTF9PsEV3CzwI9yfe7rIMnzerGqmkiU_082AWh6l8
```

### Paso 4: Deploy

1. Click en **"Deploy"**
2. Vercel construirá y desplegará tu aplicación automáticamente
3. En 1-2 minutos tendrás tu URL de producción: `https://tu-proyecto.vercel.app`

---

## Opción 2: Despliegue desde CLI de Vercel

Si prefieres desplegar desde la terminal:

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Desplegar

```bash
# Primer despliegue (interactivo)
vercel

# Seguir las instrucciones:
# - Set up and deploy? → Yes
# - Which scope? → Selecciona tu cuenta
# - Link to existing project? → No
# - Project name? → (presiona Enter para usar el nombre por defecto)
# - Directory? → ./ (presiona Enter)
# - Override settings? → No
```

### Paso 4: Configurar Variables de Entorno

```bash
# Agregar variables de entorno
vercel env add VITE_SUPABASE_URL
# Pegar el valor: https://lojcxoxwbxhzldfwlrqu.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Pegar el valor de tu anon key
```

### Paso 5: Despliegue a Producción

```bash
vercel --prod
```

---

## Configuración de Supabase para Producción

### Actualizar URL Permitidas en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Authentication** → **URL Configuration**
3. Agrega tu URL de Vercel a:
   - **Site URL**: `https://tu-proyecto.vercel.app`
   - **Redirect URLs**: `https://tu-proyecto.vercel.app/**`

---

## Verificación del Despliegue

Después del despliegue, verifica:

✅ La aplicación carga correctamente
✅ Puedes hacer login
✅ Los datos se cargan desde Supabase
✅ Puedes crear, editar y eliminar actividades
✅ Las políticas RLS funcionan correctamente

---

## Despliegues Automáticos

Una vez configurado con GitHub:

- ✅ Cada push a `main` desplegará automáticamente a producción
- ✅ Los pull requests crearán preview deployments
- ✅ Vercel te enviará notificaciones del estado del deploy

---

## Comandos Útiles

```bash
# Ver información del proyecto
vercel

# Desplegar a preview
vercel

# Desplegar a producción
vercel --prod

# Ver logs
vercel logs

# Abrir proyecto en el dashboard
vercel open
```

---

## Solución de Problemas Comunes

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Vercel

### Error: "Environment variables not found"
- Asegúrate de haber agregado las variables en Vercel Dashboard
- Las variables deben empezar con `VITE_` para ser accesibles en el frontend

### Error de CORS con Supabase
- Agrega tu dominio de Vercel a las URLs permitidas en Supabase

### La app no carga datos
- Verifica que las variables de entorno estén correctamente configuradas
- Revisa la consola del navegador para errores de autenticación

---

## URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **Supabase Dashboard**: https://app.supabase.com

---

## Notas de Seguridad

⚠️ **IMPORTANTE**:
- Nunca subas el archivo `.env` a Git
- Las variables `VITE_*` son públicas (se incluyen en el bundle del cliente)
- La `ANON_KEY` de Supabase es segura para uso público, la seguridad real está en las políticas RLS
- Asegúrate de tener las políticas RLS correctamente configuradas

---

## Actualizaciones Futuras

Para actualizar tu aplicación:

```bash
# Con GitHub (automático)
git add .
git commit -m "Descripción de cambios"
git push

# Con CLI
vercel --prod
```

Vercel detectará los cambios y desplegará automáticamente la nueva versión.
