# 🔐 Configuración de Autenticación en Supabase

## Paso 1: Configurar Autenticación en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard/project/lojcxoxwbxhzldfwlrqu)
2. En el menú lateral, ve a **Authentication** → **Providers**
3. Asegúrate de que **Email** esté habilitado (debería estarlo por defecto)

## Paso 2: Crear Usuarios en Supabase

Tienes dos opciones para crear usuarios:

### Opción A: Crear usuarios manualmente (Recomendado para empezar)

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: El correo del usuario (ej: `admin@turnos.com`)
   - **Password**: Una contraseña (ej: `Admin123!`)
   - **Auto Confirm User**: ✅ Marca esta opción (para que no necesite confirmar por email)
4. Haz clic en **"Create user"**

**Usuarios de ejemplo que puedes crear:**
- `admin@turnos.com` / `Admin123!`
- `supervisor@turnos.com` / `Super123!`
- `empleado@turnos.com` / `Empleado123!`

### Opción B: Permitir registro público (Opcional)

Si quieres que los usuarios puedan registrarse por sí mismos:
1. Ve a **Authentication** → **Settings**
2. En **"Email Auth"**, asegúrate de que:
   - **Enable email signup**: ✅ Habilitado
   - **Enable email confirmations**: Puedes deshabilitarlo para desarrollo

## Paso 3: Actualizar Políticas de Seguridad (RLS)

Necesitamos actualizar las políticas de Row Level Security para que solo usuarios autenticados puedan acceder.

Ve a **SQL Editor** y ejecuta el siguiente script:

```sql
-- Eliminar las políticas públicas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON people;
DROP POLICY IF EXISTS "Enable insert access for all users" ON people;
DROP POLICY IF EXISTS "Enable update access for all users" ON people;
DROP POLICY IF EXISTS "Enable delete access for all users" ON people;

DROP POLICY IF EXISTS "Enable read access for all users" ON activities;
DROP POLICY IF EXISTS "Enable insert access for all users" ON activities;
DROP POLICY IF EXISTS "Enable update access for all users" ON activities;
DROP POLICY IF EXISTS "Enable delete access for all users" ON activities;

DROP POLICY IF EXISTS "Enable read access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable insert access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable update access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable delete access for all users" ON completed_instances;

DROP POLICY IF EXISTS "Enable read access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable insert access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable update access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable delete access for all users" ON deleted_instances;

-- Crear nuevas políticas que requieren autenticación
-- Políticas para people
CREATE POLICY "Enable read for authenticated users" ON people
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON people
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON people
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON people
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para activities
CREATE POLICY "Enable read for authenticated users" ON activities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON activities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON activities
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON activities
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para completed_instances
CREATE POLICY "Enable read for authenticated users" ON completed_instances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON completed_instances
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON completed_instances
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON completed_instances
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para deleted_instances
CREATE POLICY "Enable read for authenticated users" ON deleted_instances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON deleted_instances
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON deleted_instances
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON deleted_instances
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

## Paso 4: Verificar la Configuración

1. Ve a **Authentication** → **Users**
2. Deberías ver los usuarios que creaste
3. Ve a **Database** → **Policies**
4. Verifica que las nuevas políticas estén activas en las 4 tablas

---

## 🎯 Resumen

Después de seguir estos pasos:
- ✅ Solo usuarios autenticados podrán acceder a la aplicación
- ✅ Necesitarán email y contraseña para iniciar sesión
- ✅ Los datos estarán protegidos por Row Level Security (RLS)
- ✅ Cada usuario ve los mismos datos (es una aplicación compartida)

## 🔄 Próximos Pasos

Una vez que hayas:
1. ✅ Creado al menos un usuario de prueba
2. ✅ Ejecutado el script SQL para actualizar las políticas

**Avísame y continuaré con la implementación del login en la aplicación web.**

---

## 📱 Características que se implementarán:

- **Pantalla de Login** con email y password
- **Logout** en el header de la aplicación
- **Sesión persistente** (el usuario no necesita loguearse cada vez)
- **Protección de rutas** (redirigir al login si no está autenticado)
- **Información del usuario** en el header (mostrar email del usuario logueado)
