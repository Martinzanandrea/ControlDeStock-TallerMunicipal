# Control de Stock - Taller Municipal

Aplicación web (backend NestJS + frontend React) para gestionar productos, depósitos, vehículos y movimientos de stock (ingresos y egresos), con autenticación JWT, reportes (Excel/PDF) y auditoría de acciones.

> Autor: Martin Zanandrea

## Tecnologías

- Backend: NestJS, TypeORM (PostgreSQL), JWT, ExcelJS, PDFKit
- Frontend: React + Vite, TypeScript, Material UI, React Router
- Auditoría: Interceptor que guarda usuario, acción, método y ruta

## Módulos principales

| Dominio            | Descripción                                                        |
| ------------------ | ------------------------------------------------------------------ |
| Productos          | ABM de productos con tipo, marca, depósito y stockActual calculado |
| Tipos de Producto  | Catálogo de categorías                                             |
| Marcas de Producto | Catálogo de marcas                                                 |
| Depósitos          | Lugares físicos de almacenamiento                                  |
| Vehículos          | Destino posible para egresos                                       |
| Stock Ingresado    | Registra entradas al depósito                                      |
| Stock Egreso       | Registra salidas (a oficina o vehículo) con validaciones           |
| Reportes           | Agregados y exportaciones Excel/PDF                                |
| Auditoría          | Log de cada request no público                                     |
| Usuarios/Auth      | Registro, login y guard JWT                                        |

## Flujo general

1. Usuario se autentica (login) y obtiene token JWT.
2. Gestiona catálogos (tipos, marcas, depósitos, productos, vehículos).
3. Registra ingresos y egresos (controla stock y fechas válidas).
4. Consulta reportes y exporta a Excel o PDF.
5. Auditoría registra cada acción (visible en /auditoria del frontend).

## Instalación rápida

```bash
# Backend
cd backend
npm install
cp .env.example .env   # (si existe; si no crear con variables abajo)
npm run start:dev

# Frontend
cd ../frontend
npm install
npm run dev
```

## Variables de entorno backend

Crear `.env` en `backend/` (valores de ejemplo):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=taller
JWT_SECRET=dev-secret
JWT_EXPIRES=3600
```

## Endpoints principales (resumen)

| Recurso                  | Método | Ruta                                     | Descripción       |
| ------------------------ | ------ | ---------------------------------------- | ----------------- |
| Auth                     | POST   | /auth/login                              | Login usuario     |
| Auth                     | POST   | /auth/register                           | Registrar usuario |
| Productos                | GET    | /productos                               | Listar            |
| Productos                | POST   | /productos                               | Crear             |
| Productos                | PUT    | /productos/:id                           | Actualizar        |
| Productos                | DELETE | /productos/:id                           | Baja lógica       |
| Tipos                    | GET    | /productostipos                          | Listar tipos      |
| Marcas                   | GET    | /productomarca                           | Listar marcas     |
| Depósitos                | GET    | /depositos                               | Listar            |
| Vehículos                | GET    | /vehiculos                               | Listar            |
| Ingresos                 | GET    | /stockingresado                          | Listar ingresos   |
| Egresos                  | GET    | /stockegreso                             | Listar egresos    |
| Reporte stock tipo       | GET    | /reportes/stock/tipo                     | JSON agregado     |
| Reporte stock tipo Excel | GET    | /reportes/stock/tipo.xlsx                | Descarga          |
| Historial producto       | GET    | /reportes/historial/producto/:idProducto | Movimientos       |
| Auditoría                | GET    | /auditoria                               | Últimos logs      |

## Reglas y validaciones

- Fechas de ingreso/egreso no pueden ser futuras.
- Egreso no puede superar el stock disponible (suma ingresos - egresos previos por depósito + producto).
- Baja lógica: se usa estado 'AC'/'BA' para entidades (no se borra físicamente).
- Auditoría ignora rutas públicas (decorador `@Public()`).
- Passwords hasheadas con bcrypt.

## Auditoría

Interceptor captura: usuario (id/username), método HTTP, acción derivada (READ/CREATE/UPDATE/DELETE), ruta, params/query/body (con filtrado de campos sensibles) y timestamp.

## Exportaciones

- Excel: ExcelJS genera buffer en memoria y se devuelve como attachment.
- PDF: PDFKit escribe en stream y se concatena a Buffer.

## Frontend (UX básica)

- Menú: Productos, Stock, Egresos, Vehículos, Depósitos, Auditoría.
- Tablas con mensajes de vacío y botones de exportación.
- Vista Auditoría: hora, usuario y acción con chips de color.

## Scripts útiles backend

```bash
npm run start:dev   # modo desarrollo
npm run build       # compila
npm run test        # unit tests (si se añaden)
```

## Scripts útiles frontend

```bash
npm run dev     # desarrollo (Vite)
npm run build   # build producción
```

## Próximas mejoras sugeridas

- Paginación y filtros en auditoría.
- Tests e2e para validaciones de stock.
- Roles/Permisos avanzados.
- Cache para reportes grandes.
- Verificación de documento externo (pendiente).

## Licencia

Uso interno municipal (adaptar según necesidad).

---
