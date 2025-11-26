# 📝 Instrucciones para Integrar Supabase

## ✅ Ya está preparado:

1. ✅ Esquema SQL creado ([supabase-schema.sql](supabase-schema.sql))
2. ✅ Dependencia instalada (`@supabase/supabase-js`)
3. ✅ Configuración de Supabase lista ([src/config/supabase.js](src/config/supabase.js))
4. ✅ Servicios de API creados ([src/services/supabaseService.js](src/services/supabaseService.js))
5. ✅ Hook personalizado creado ([src/hooks/useSupabaseData.js](src/hooks/useSupabaseData.js))

## 🔧 Pasos que debes seguir:

### 1. Configurar la Base de Datos

Sigue las instrucciones en [SUPABASE_SETUP.md](SUPABASE_SETUP.md):
- Crea un proyecto en Supabase
- Ejecuta el script SQL
- Obtén tus credenciales

### 2. Crear el archivo .env

Una vez que tengas tus credenciales de Supabase:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Luego abre el archivo `.env` y completa con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

### 3. Proporcionar las credenciales

**Necesito que me proporciones:**

1. **Project URL** (la URL de tu proyecto de Supabase)
2. **Anon Key** (la clave pública/anon de tu proyecto)

Las puedes encontrar en:
- Supabase Dashboard → Settings → API

Una vez que me las proporciones, actualizaré el código para que use Supabase en lugar de localStorage.

---

## 🔄 Cambios que se realizarán:

Cuando proporciones las credenciales, actualizaré:

1. **App.jsx**: Reemplazar la lógica de localStorage por el hook `useSupabaseData`
2. **Crear archivo .env**: Con tus credenciales reales
3. **Probar la conexión**: Verificar que todo funcione correctamente

---

## 📊 Estructura de Datos

### Migración de LocalStorage a Supabase:

**Antes (LocalStorage):**
```javascript
{
  id: "abc123",
  name: "Ana García"
}
```

**Después (Supabase):**
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",  // UUID
  name: "Ana García",
  created_at: "2025-01-26T...",
  updated_at: "2025-01-26T..."
}
```

**Nota:** Los IDs cambian de strings aleatorios a UUIDs, pero la funcionalidad es la misma.

---

## ⚡ Ventajas de usar Supabase:

- ✅ Sincronización automática entre dispositivos
- ✅ Datos persistentes en la nube
- ✅ Backup automático
- ✅ Posibilidad de agregar autenticación más adelante
- ✅ Escalable para múltiples usuarios
- ✅ API REST y Realtime incluidas

---

## 🚦 Estado Actual:

⏳ **Esperando credenciales de Supabase para completar la integración**

Una vez que proporciones:
1. VITE_SUPABASE_URL
2. VITE_SUPABASE_ANON_KEY

Completaré la integración y la app estará completamente conectada a Supabase.
