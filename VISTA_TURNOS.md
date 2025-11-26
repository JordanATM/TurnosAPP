# 📊 Vista de Resumen de Turnos

## Descripción

Se ha agregado una nueva vista al sistema que muestra un resumen mensual de los turnos asignados por ingeniero. Esta vista complementa la vista de calendario existente y permite visualizar de manera clara la distribución de turnos.

## Características

### 🎯 Estadísticas Generales
- Contador total de turnos del mes
- Contador por tipo de turno:
  - **Mañana** (08:00 - 15:00) - Icono de Sol
  - **Tarde** (16:00 - 23:00) - Icono de Atardecer
  - **Noche** (00:00 - 07:00) - Icono de Luna

### 📋 Tabla de Turnos por Ingeniero
Muestra una tabla con:
- Nombre del ingeniero con avatar con iniciales
- Cantidad de turnos de mañana
- Cantidad de turnos de tarde
- Cantidad de turnos de noche
- Total de turnos asignados

### 📅 Detalle por Ingeniero
Tarjetas individuales que muestran:
- Qué días del mes tiene turnos de mañana
- Qué días del mes tiene turnos de tarde
- Qué días del mes tiene turnos de noche

## Navegación

### Desktop
En pantallas grandes (≥768px), verás dos botones de navegación:
- **Calendario**: Vista tradicional del calendario mensual
- **Turnos**: Vista de resumen de turnos (nueva)

### Mobile
En pantallas pequeñas (<768px), hay un solo botón toggle que alterna entre las dos vistas.

## Uso

1. **Cambiar entre vistas**: Click en los botones "Calendario" o "Turnos" en el header
2. **Navegar entre meses**: Los controles de navegación (◀ ▶) funcionan en ambas vistas
3. **Ver detalle**: En la vista de turnos, puedes ver tanto la tabla resumen como las tarjetas de detalle

## Funcionamiento Técnico

### Componentes Nuevos

#### `ShiftsSummary.jsx`
```
src/components/shifts/ShiftsSummary.jsx
```
Componente principal que calcula y muestra el resumen de turnos.

**Props:**
- `currentDate`: Fecha actual para determinar el mes a mostrar
- `activities`: Todas las actividades del sistema
- `deletedInstances`: Instancias eliminadas
- `people`: Lista de personas/ingenieros

**Funcionalidad:**
- Calcula dinámicamente todos los días del mes
- Filtra actividades visibles usando `isActivityVisibleOnDate`
- Agrupa turnos por persona y tipo (mañana/tarde/noche)
- Genera estadísticas generales

### Funciones Utilitarias Nuevas

#### `isActivityVisibleOnDate`
```javascript
src/utils/helpers.js
```

Función reutilizable que determina si una actividad debe mostrarse en una fecha específica.

**Considera:**
- Fecha de inicio de la actividad
- Fecha de finalización (`endDate`) si existe
- Instancias eliminadas individualmente
- Frecuencia (once, daily, weekdays)
- Día de la semana

**Uso:**
```javascript
const isVisible = isActivityVisibleOnDate(activity, '2025-01-26', deletedInstances);
```

## Cambios en Componentes Existentes

### `CalendarHeader.jsx`
- Agregados botones de navegación entre vistas
- Nuevos íconos: `LayoutGrid` (calendario) y `ClipboardList` (turnos)
- Props nuevos: `currentView`, `onViewChange`

### `App.jsx`
- Estado nuevo: `currentView` ('calendar' | 'shifts')
- Renderizado condicional basado en la vista activa
- Ambas vistas comparten la misma navegación de mes

## Beneficios

✅ **Visión general rápida**: Ver de un vistazo la distribución de turnos del mes

✅ **Equidad de carga**: Identificar fácilmente si algún ingeniero tiene más turnos que otros

✅ **Planificación mejorada**: Ver patrones y distribución de turnos

✅ **Datos específicos**: Saber exactamente qué días trabaja cada ingeniero

✅ **Compatible con funcionalidad existente**:
- Respeta actividades recurrentes
- Respeta instancias eliminadas
- Respeta fechas de finalización
- Considera todas las frecuencias

## Ejemplo de Datos

Si un ingeniero tiene:
- 5 turnos de mañana (días 2, 5, 9, 15, 22)
- 3 turnos de tarde (días 10, 17, 24)
- 2 turnos de noche (días 1, 8)

La vista mostrará:
- Tabla: 5 | 3 | 2 | Total: 10
- Detalle: "Días mañana: 2, 5, 9, 15, 22"

## Colores y Diseño

### Turnos de Mañana
- Color: Amarillo (`yellow-100`, `yellow-600`, `yellow-700`)
- Icono: ☀️ Sol

### Turnos de Tarde
- Color: Naranja (`orange-100`, `orange-600`, `orange-700`)
- Icono: 🌅 Atardecer

### Turnos de Noche
- Color: Índigo (`indigo-100`, `indigo-600`, `indigo-700`)
- Icono: 🌙 Luna

### Total General
- Color: Azul (`blue-100`, `blue-600`, `blue-700`)

## Casos Especiales

### Sin Ingenieros
Si no hay ingenieros registrados, se muestra un mensaje indicando que se deben agregar desde "Gestionar Personal".

### Sin Turnos
Si un ingeniero no tiene turnos asignados en el mes, no aparece en las tarjetas de detalle (solo en la tabla con 0s).

### Navegación de Meses
Al cambiar de mes, los datos se recalculan automáticamente para el nuevo período.

## Compatibilidad

✅ Funciona con todas las frecuencias (once, daily, weekdays)
✅ Respeta instancias eliminadas individualmente
✅ Considera fechas de finalización de series recurrentes
✅ Calcula correctamente turnos según la hora asignada
✅ Responsive: se adapta a móvil, tablet y desktop

## Mantenimiento Futuro

Para agregar nuevos tipos de turno:
1. Actualizar `src/constants/shifts.js`
2. Actualizar el cálculo en `ShiftsSummary.jsx`
3. Agregar nueva columna en la tabla
4. Agregar nuevo indicador en estadísticas generales
