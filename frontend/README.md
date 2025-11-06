# Frontend React - Control de Stock

Interfaz web para gestionar productos, depósitos, vehículos, ingresos/egresos y visualizar auditoría y reportes.

> Autor: Martin Zanandrea

## Tecnologías

- React + Vite (TypeScript)
- Material UI (tablas, botones, chips)
- React Router (rutas protegidas)
- Excel/PDF descarga vía endpoints del backend
- MUI Date Pickers (dayjs) para selección de fechas
- Dark/Light mode toggle centralizado

## Estructura rápida

```
src/
  api.ts          # funciones para llamar a la API y descargar reportes
  auth.ts         # manejo de token y usuario en localStorage
  components/     # vistas (Productos, Stock, Egresos, Vehiculos, Depositos, Auditoria, Login, Register)
  types.ts / interface.ts  # Tipos compartidos
  theme.tsx       # Tema MUI (paleta verde, tipografía Inter, dark mode)
  components/StockProductoDeposito.tsx  # Reporte agregado dinámico
```

## Scripts

```bash
npm run dev     # modo desarrollo
npm run build   # compilación producción
npm run lint    # reglas ESLint/TS
```

## Flujo de uso

1. Login o registro para obtener token.
2. Navegar por el menú (Productos, Stock, Egresos, etc.).
3. Crear elementos y registrar ingresos/egresos.
4. Exportar reportes (botones Excel/PDF).
5. Revisar acciones en la vista Auditoría.
6. Consultar Stock x Depósito para ver existencias actuales (>0).

## Autenticación

- Token JWT almacenado en `localStorage` (`tm_token`).
- Se añade automáticamente en headers dentro de `api.ts`.
- Rutas públicas: `/login`, `/register`.
- Descargas (Excel/PDF) reutilizan helper de headers para evitar 401.

## Auditoría (vista `/auditoria`)

Tabla pequeña con columnas Hora, Usuario y Acción (Chip de color). Extrae últimos 100 registros.
Filtra solo CREATE / UPDATE / DELETE (se excluyen lecturas).

## Estilos y responsive

- Material UI theme ajusta paddings y tamaños para móviles (`breakpoints.down('md')`).
- Tablas usan tamaño `small` y mensajes de “sin datos” cuando listas vacías.
- Navbar centrado en desktop, logo enlaza al inicio y título institucional fuera del AppBar.
- Inicio, Login y Register con imágenes de fondo y overlay para legibilidad.

## Mejoras futuras

- Filtros y paginación en auditoría.
- Búsqueda y orden avanzado en tablas.
- Manejo de roles (admin vs usuario).
- Indicador visual de ruta activa en navbar.
- Paginación en reportes grandes.

Documento conciso para entender rápido cómo trabajar con el frontend.
