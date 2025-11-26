# 📅 Sistema de Gestión de Turnos

## Descripción

Se ha implementado un **sistema completamente independiente** para gestionar turnos de ingenieros. Este sistema es separado del calendario de actividades y permite asignar turnos manualmente.

## 🎯 Características Principales

### 1. Calendario de Turnos Independiente
- Vista de calendario mensual dedicada solo a turnos
- Indicadores visuales por tipo de turno (Mañana, Tarde, Noche)
- Click en cualquier día para asignar/quitar turnos
- Contador de turnos por día

### 2. Asignación Manual de Turnos
- Modal interactivo para asignar turnos por ingeniero
- Tabla con todos los ingenieros y tipos de turno
- Click para toggle (agregar/quitar) turnos
- Cambios se guardan automáticamente
- Resumen en tiempo real

### 3. Estadísticas de Turnos
- Total de turnos por tipo (Mañana/Tarde/Noche)
- Distribución por ingeniero
- Tabla visual con contadores
- Se actualiza automáticamente al cambiar de mes

## 🔧 Instalación y Configuración

### Paso 1: Ejecutar el Script SQL en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Abre el archivo [`supabase-shifts-schema.sql`](supabase-shifts-schema.sql)
4. Copia todo el contenido
5. Pégalo en el editor SQL de Supabase
6. Click en **"Run"** o presiona `Ctrl/Cmd + Enter`

El script creará:
- ✅ Tabla `shifts` para almacenar turnos
- ✅ Índices para optimizar consultas
- ✅ Políticas RLS para seguridad
- ✅ Trigger para `updated_at`
- ✅ Vista `shifts_with_person` (útil para queries)

### Paso 2: Verificar la Creación

Ejecuta este query para verificar:

```sql
SELECT * FROM shifts LIMIT 1;
```

Si no hay error, ¡todo está listo!

## 📊 Estructura de Datos

### Tabla `shifts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del turno |
| `person_id` | UUID | ID del ingeniero (FK a `people`) |
| `date` | DATE | Fecha del turno (YYYY-MM-DD) |
| `shift_type` | TEXT | Tipo: 'morning', 'afternoon', 'night' |
| `notes` | TEXT | Notas opcionales |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

**Constraint único:** `(person_id, date, shift_type)`
- Un ingeniero NO puede tener el mismo tipo de turno dos veces en el mismo día

## 🎨 Tipos de Turno

| Tipo | Horario | Color | Icono |
|------|---------|-------|-------|
| **morning** | 08:00 - 15:00 | Amarillo | ☀️ Sol |
| **afternoon** | 16:00 - 23:00 | Naranja | 🌅 Atardecer |
| **night** | 00:00 - 07:00 | Índigo | 🌙 Luna |

## 🚀 Uso de la Aplicación

### Navegar a la Vista de Turnos

1. Inicia la aplicación: `npm run dev`
2. Haz login
3. Click en el botón **"Turnos"** en el header (al lado de "Calendario")

### Asignar Turnos a un Día

1. En la vista de Turnos, click en cualquier día del calendario
2. Se abrirá el modal de asignación
3. Click en los cuadros para asignar/quitar turnos a cada ingeniero
4. Los cambios se guardan automáticamente
5. Click en "Cerrar" cuando termines

### Ver Estadísticas

Debajo del calendario verás:
- Total de turnos por tipo (Mañana, Tarde, Noche)
- Tabla con la distribución por ingeniero
- Contadores individuales

### Navegar Entre Meses

Los botones ◀ ▶ y "Hoy" funcionan igual que en el calendario de actividades.

## 🔄 Diferencias con el Calendario de Actividades

| Aspecto | Calendario de Actividades | Sistema de Turnos |
|---------|---------------------------|-------------------|
| **Propósito** | Tareas y actividades del equipo | Turnos de trabajo por persona |
| **Asignación** | Automática según frecuencia | Manual, día por día |
| **Recurrencia** | Sí (daily, weekdays, once) | No |
| **Completar tareas** | Sí | No aplica |
| **Tabla de BD** | `activities` | `shifts` |
| **Dependencia** | Completamente separado | Completamente separado |

## 📁 Archivos del Sistema

### Backend/Servicios
- `src/services/shiftsService.js` - Funciones para interactuar con Supabase
- `src/hooks/useShifts.js` - Hook personalizado para manejar estado de turnos

### Componentes UI
- `src/components/shifts/ShiftsCalendar.jsx` - Calendario de turnos
- `src/components/shifts/ShiftsStats.jsx` - Estadísticas y tabla
- `src/components/modals/AssignShiftModal.jsx` - Modal de asignación

### Base de Datos
- `supabase-shifts-schema.sql` - Script SQL para crear tabla y políticas

## 💡 Ejemplos de Uso

### Caso 1: Asignar turno de mañana a un ingeniero

1. Click en el día 15 del mes
2. Buscar el ingeniero en la tabla
3. Click en el cuadro bajo "Mañana" ☀️
4. El cuadro se marcará con ✓
5. Cerrar el modal

### Caso 2: Asignar múltiples turnos el mismo día

1. Click en el día 20
2. Asignar turno de mañana a Ana
3. Asignar turno de tarde a Carlos
4. Asignar turno de noche a María
5. Ver resumen: 1 mañana, 1 tarde, 1 noche

### Caso 3: Ver distribución del mes

1. Ir a la vista de Turnos
2. Scroll hasta las estadísticas
3. Ver la tabla con totales por ingeniero
4. Verificar equidad de carga

## ⚠️ Validaciones

### El sistema previene:

✅ Asignar el mismo tipo de turno dos veces al mismo ingeniero en el mismo día
✅ Crear turnos sin ingeniero asignado
✅ Fechas inválidas
✅ Acceso no autenticado (gracias a RLS)

### El sistema permite:

✅ Asignar diferentes tipos de turno al mismo ingeniero el mismo día
✅ Asignar el mismo tipo de turno a múltiples ingenieros el mismo día
✅ Modificar o eliminar turnos existentes
✅ Agregar notas a los turnos (campo opcional)

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitada
- Solo usuarios autenticados pueden:
  - Leer turnos
  - Crear turnos
  - Actualizar turnos
  - Eliminar turnos
- Las políticas son las mismas que en las otras tablas

## 🎯 Próximas Mejoras Posibles

Funcionalidades que se podrían agregar en el futuro:

- 📋 Exportar turnos a PDF o Excel
- 📧 Enviar notificaciones por email a ingenieros asignados
- 🔄 Copiar turnos de una semana a otra
- 📊 Gráficos de distribución de carga
- 🎨 Colores personalizados por ingeniero
- 📝 Notas más detalladas por turno
- ⏰ Recordatorios automáticos
- 📱 Vista móvil optimizada para agregar turnos rápidamente

## 🐛 Solución de Problemas

### Error: "relation 'shifts' does not exist"

**Solución:** Ejecuta el script SQL `supabase-shifts-schema.sql` en Supabase

### Error: "permission denied for table shifts"

**Solución:** Verifica que las políticas RLS estén creadas. Re-ejecuta la parte de políticas del script SQL.

### Los turnos no se muestran en el calendario

1. Verifica que estés en la vista correcta (botón "Turnos")
2. Abre las DevTools (F12) → Console para ver errores
3. Verifica que el mes actual tenga turnos asignados

### Build falla

```bash
npm run build
```

Si el build falla, revisa:
- Que todos los archivos existan
- Que los imports estén correctos
- Que no haya errores de sintaxis

## ✅ Checklist de Implementación

Para verificar que todo está funcionando:

- [ ] Script SQL ejecutado en Supabase ✓
- [ ] Tabla `shifts` existe en la base de datos ✓
- [ ] Build del proyecto funciona (`npm run build`) ✓
- [ ] Aplicación inicia sin errores (`npm run dev`) ✓
- [ ] Vista de "Turnos" se muestra correctamente ✓
- [ ] Puedo abrir el modal de asignación ✓
- [ ] Puedo asignar turnos a ingenieros ✓
- [ ] Los turnos se guardan en la base de datos ✓
- [ ] Las estadísticas se actualizan correctamente ✓
- [ ] Navegación entre meses funciona ✓

## 📞 Soporte

Si encuentras algún problema, verifica:

1. Consola del navegador (F12) para errores JavaScript
2. Network tab para errores de API/Supabase
3. Supabase Logs para errores de base de datos

---

**Versión:** 2.0
**Última actualización:** Enero 2025
