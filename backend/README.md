<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descripción

Backend del proyecto “Control de Stock en Taller Municipal”. API REST con NestJS + TypeORM (PostgreSQL), autenticación JWT, reportes (Excel/PDF) y auditoría.

> Autor: Martin Zanandrea

## Configuración del proyecto

```bash
$ npm install
```

## Compilar y ejecutar

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Variables de entorno

Crear `.env` en `backend/`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=taller
JWT_SECRET=dev-secret
JWT_EXPIRES=3600
```

## Arquitectura y módulos

- `auth/`: login, registro y guard JWT.
- `producto/`, `producto-tipo/`, `producto-marca/`, `deposito/`, `vehiculo/`: catálogos.
- `stock-ingresado/`, `stock-egreso/`: movimientos de stock con validaciones.
- `reportes/`: agregados y exportación a Excel/PDF.
- `auditoria/`: interceptor y endpoint de consulta de logs.

## Endpoints más usados

- Auth: `POST /auth/login`, `POST /auth/register`
- Productos: `GET/POST/PUT/DELETE /productos`
- Reportes agregados:
  - `GET /reportes/stock/tipo`
  - Historial por producto (JSON/Excel/PDF):
    - `GET /reportes/historial/producto/:idProducto`
    - `GET /reportes/historial/producto/:idProducto/excel`
    - `GET /reportes/historial/producto/:idProducto/pdf`
  - Stock por producto y depósito (JSON/Excel/PDF):
    - `GET /reportes/stock/producto-deposito`
    - `GET /reportes/stock/producto-deposito/excel`
    - `GET /reportes/stock/producto-deposito/pdf`
- Auditoría: `GET /auditoria?limit=100`

## Convenciones

- Baja lógica con campo `estado` ('AC'/'BA').
- Validación de fechas (no futuras) y stock suficiente en egresos.
- Auditoría ignora endpoints marcados con `@Public()`.
- Rutas de descarga refactorizadas a sufijos `/excel` y `/pdf` para evitar conflictos de parseo.

## Notas

Para PDFs se usa `pdfkit` (CJS) con import por defecto. Para Excel, `exceljs` generando buffer.
TypeORM se configura en `app.module.ts` con reintentos de conexión.
