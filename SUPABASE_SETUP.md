# 🚀 Configuración de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa los datos:
   - **Project name**: Turnos (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala bien)
   - **Region**: Selecciona la más cercana a tu ubicación
5. Haz clic en "Create new project" y espera a que se complete la creación

## Paso 2: Ejecutar el Esquema SQL

1. En tu proyecto de Supabase, ve a la sección **SQL Editor** (icono de código en el menú lateral)
2. Haz clic en "+ New query"
3. Abre el archivo `supabase-schema.sql` que está en la raíz de este proyecto
4. Copia todo su contenido y pégalo en el editor SQL de Supabase
5. Haz clic en "Run" o presiona `Ctrl+Enter` para ejecutar el script
6. Deberías ver un mensaje de éxito indicando que las tablas fueron creadas

## Paso 3: Verificar las Tablas Creadas

Ve a la sección **Table Editor** (icono de tabla) y verifica que se crearon las siguientes tablas:
- ✅ `people` - Personal
- ✅ `activities` - Actividades/Turnos
- ✅ `completed_instances` - Instancias completadas
- ✅ `deleted_instances` - Instancias eliminadas

## Paso 4: Obtener las Credenciales

1. Ve a **Settings** (⚙️ en el menú lateral)
2. Selecciona **API** en el submenú
3. Busca y copia los siguientes valores:

### Credenciales necesarias:

**Project URL:**
```
https://tu-proyecto.supabase.co
```

**API Key (anon/public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 5: Proporcionar las Credenciales

Una vez que tengas estas dos credenciales, compártelas para integrarlas en la aplicación.

---

## 📊 Estructura de la Base de Datos

### Tabla: `people`
Almacena el personal/empleados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| name | TEXT | Nombre del empleado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### Tabla: `activities`
Almacena las actividades y turnos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| title | TEXT | Título de la actividad |
| time | TEXT | Hora (HH:MM) |
| frequency | TEXT | Frecuencia: 'once', 'daily', 'weekdays' |
| date | TEXT | Fecha de inicio (YYYY-MM-DD) |
| end_date | TEXT | Fecha de fin (opcional) |
| description | TEXT | Descripción (opcional) |
| assignees | UUID[] | Array de IDs de personas asignadas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### Tabla: `completed_instances`
Registra qué instancias específicas fueron completadas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| activity_id | UUID | ID de la actividad |
| date | TEXT | Fecha de la instancia (YYYY-MM-DD) |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `deleted_instances`
Registra instancias eliminadas de series recurrentes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| activity_id | UUID | ID de la actividad |
| date | TEXT | Fecha de la instancia (YYYY-MM-DD) |
| created_at | TIMESTAMP | Fecha de creación |

---

## 🔒 Seguridad

Las políticas de Row Level Security (RLS) están configuradas para permitir acceso público sin autenticación. Si necesitas agregar autenticación más adelante, las políticas pueden modificarse para usar `auth.uid()`.

## ⚠️ Notas Importantes

- Los datos de ejemplo (3 personas) se insertan automáticamente con el script
- Todos los IDs son UUID generados automáticamente
- Los campos `updated_at` se actualizan automáticamente con triggers
- Las restricciones UNIQUE evitan duplicados en instancias completadas/eliminadas
