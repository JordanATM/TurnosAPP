# 🚀 Despliegue Rápido en Vercel

## Opción Más Rápida: GitHub + Vercel (5 minutos)

### 1. Subir a GitHub

```bash
# Inicializar repositorio (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Ready for deployment"

# Crear repo en GitHub y conectar (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/turnos.git
git branch -M main
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ve a https://vercel.com e inicia sesión con GitHub
2. Click en **"Add New"** → **"Project"**
3. Selecciona el repositorio que acabas de crear
4. En **"Environment Variables"** agrega:
   - `VITE_SUPABASE_URL` = `https://lojcxoxwbxhzldfwlrqu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvamN4b3h3YnhoemxkZndscnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjA5NDEsImV4cCI6MjA3OTczNjk0MX0.Q1bTF9PsEV3CzwI9yfe7rIMnzerGqmkiU_082AWh6l8`
5. Click en **"Deploy"**
6. ¡Espera 1-2 minutos y listo!

### 3. Configurar Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Agrega tu URL de Vercel (ejemplo: `https://turnos-xyz.vercel.app`)
   - **Site URL**: `https://tu-proyecto.vercel.app`
   - **Redirect URLs**: `https://tu-proyecto.vercel.app/**`

---

## ✅ Ya Está Listo Tu Proyecto

- ✅ Build funciona correctamente (`npm run build`)
- ✅ Variables de entorno configuradas en `.env`
- ✅ `.gitignore` correctamente configurado
- ✅ `vercel.json` creado para optimizar el despliegue
- ✅ Autenticación implementada

---

## 📋 Checklist Final

Antes de desplegar, verifica:

- [ ] El archivo `.env` NO está en el repositorio de Git
- [ ] Probaste el build localmente (`npm run build`)
- [ ] La aplicación funciona en modo dev (`npm run dev`)
- [ ] Las credenciales de Supabase son correctas
- [ ] Has ejecutado el script `supabase-rls-authenticated.sql` en Supabase

---

## 🎉 Después del Despliegue

1. Visita tu URL de Vercel
2. Prueba hacer login
3. Verifica que puedas crear/editar actividades
4. Comparte la URL con tu equipo

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel detectará automáticamente los cambios y desplegará la nueva versión.

---

Para más detalles, consulta [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)
