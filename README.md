# Planificador de Turnos

Aplicación web para la gestión de turnos y actividades del personal.

## Características

- **Gestión de Turnos**: Organiza turnos de mañana, tarde y noche
- **Actividades Recurrentes**: Crea actividades que se repiten diariamente o entre semana
- **Gestión de Personal**: Asigna responsables a cada actividad
- **Estado de Tareas**: Marca actividades como completadas
- **Persistencia Local**: Los datos se guardan automáticamente en el navegador

## Estructura del Proyecto

```
Turnos/
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   ├── CalendarDay.jsx
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── CalendarHeader.jsx
│   │   │   └── CalendarNavigation.jsx
│   │   └── modals/
│   │       ├── ActivityModal.jsx
│   │       └── PeopleModal.jsx
│   ├── constants/
│   │   ├── calendar.js
│   │   ├── frequency.js
│   │   ├── shifts.js
│   │   └── index.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── shifts.js
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm run preview
```

## Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de compilación rápida
- **Tailwind CSS** - Framework CSS de utilidades
- **Lucide React** - Iconos
- **LocalStorage API** - Persistencia de datos

## Uso

1. **Gestionar Personal**: Haz clic en "Personal" para agregar o eliminar empleados
2. **Crear Actividad**: Haz clic en "Nueva Actividad" o en cualquier día del calendario
3. **Editar Actividad**: Haz clic en una actividad existente para editarla
4. **Marcar como Completada**: Haz clic en el círculo a la derecha de cada actividad
5. **Configurar Recurrencia**: Al crear/editar una actividad, selecciona la frecuencia deseada

## Licencia

ISC
