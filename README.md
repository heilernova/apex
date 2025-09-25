# Apex

<div align="center">
  
  <img src="./media/logo.svg?text=Contable.dev" alt="Contable.dev Logo" width="90" height="90" />
  
  **Aplicación para atletas y gimnasios de CrossFit**
  
  [![Built with Nx](https://img.shields.io/badge/built%20with-Nx-143055.svg?logo=nx&logoColor=white)](https://nx.dev)
  [![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)](https://angular.io)
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![JWT](https://img.shields.io/badge/JWT-000000?logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io)

</div>

Aplicación para atletas y gimnasios de CrossFit. Vivirá bajo el dominio: https://apex.novah.dev

Con Apex podrás registrar y consultar tus mejores marcas (RMs/PRs), resultados de WODs, explorar ejercicios y WODs, gestionar perfiles de gimnasios y atletas, y publicar competencias con su respectivo flujo de inscripciones.

Estado del proyecto: en desarrollo.

## ✨ Características clave

- Registro de RMs/PRs por levantamiento y seguimiento de progreso.
- Historial de resultados de WODs (tiempos, rondas, repeticiones, carga).
- Catálogo de ejercicios y WODs con descripciones y estándares.
- Perfiles de atletas y gimnasios (bio, ubicación, redes, récords y programación).
- Módulo de competencias: publicación, categorías, reglas y registro de atletas/equipos.
- Renderizado del sitio con SSR para mejor SEO y tiempos de carga iniciales.

## 🧱 Stack técnico

- Monorepo con Nx.
- Angular 20 con SSR (builder `@angular/build:application`).
- Servidor Express para SSR (`apps/web/src/server.ts`).
- Tests con Vitest.
- Lint con ESLint.

Carpeta principal de la app web: `apps/web`.

## 🚀 Desarrollo local

Requisitos:

- Node.js 20 LTS (recomendado).
- npm (o pnpm/yarn si así se configura el repo).

Instalación de dependencias:

```sh
npm install
```

Levantar el servidor de desarrollo (hot reload):

```sh
npx nx serve web
```

Esto ejecuta el dev server de Angular con SSR integrado en modo desarrollo.

## 🏗️ Builds y ejecución

Build de producción (SSR):

```sh
npx nx build web
```

Este comando genera artefactos en `dist/apps/web` (subcarpetas `browser` y `server`). El servidor SSR usa la variable de entorno `PORT` si está definida.

Ejemplo de ejecución SSR con Node (el nombre del archivo puede variar según la versión de Angular/CLI):

```sh
# Establece el puerto si lo necesitas
export PORT=4000

# Arranca el bundle del servidor (ajusta la ruta si es diferente en tu build)
node dist/apps/web/server/server.mjs
```

Alternativa estática (sin SSR) para servir sólo el contenido de `browser`:

```sh
npx nx serve-static web
```

## 🧪 Tests y calidad

Ejecutar pruebas unitarias:

```sh
npx nx test web
```

Linting:

```sh
npx nx lint web
```

Extracción de i18n (si se utiliza):

```sh
npx nx extract-i18n web
```

Ver tareas disponibles del proyecto:

```sh
npx nx show project web
```

## 📂 Estructura breve

- `apps/web/src` — Código fuente de la aplicación Angular.
- `apps/web/src/server.ts` — Servidor Express para SSR.
- `apps/web/project.json` — Targets de Nx (build, serve, test, lint, etc.).
- `dist/apps/web` — Salida de builds (`browser` y `server`).

## 🧭 Estructura del proyecto (objetivo)

El monorepo estará organizado así:

```
apex/
├─ apps/
│  ├─ web/                 # Aplicación Angular (SSR)
│  └─ api/                 # API NestJS (pendiente de generar)
├─ libs/
│  ├─ shared/              # Módulos compartidos (utils, UI, modelos)
│  └─ schemas/             # Esquemas/DTO/validaciones compartidas
├─ database/
│  ├─ schema/              # Definición del esquema BD / migraciones
│  └─ seeds/               # Datos semilla
└─ scripts/                # Scripts internos de mantenimiento/CLI
```

Notas:

- `apps/api` albergará la API de NestJS que servirá endpoints para atletas, gimnasios, WODs y competencias.
- `libs/shared` y `libs/schemas` serán librerías Nx reutilizables por `web` y `api`.
- `database` contendrá el esquema y migraciones (p. ej., Prisma/SQL) y semillas.
- `scripts` incluirá comandos internos (p. ej., seed, import/export, tareas de mantenimiento).

### Sugerencia de scaffolding con Nx (pendiente)

Puedes generar los artefactos cuando estés listo. Si no tienes el plugin de Nest instalado, agrégalo primero.

```bash
# Instalar plugin de Nest para Nx (devDependency)
npm i -D @nx/nest

# Generar la API NestJS
npx nx g @nx/nest:app api

# Generar librerías compartidas
npx nx g @nx/js:lib shared --directory=libs --bundler=none
npx nx g @nx/js:lib schemas --directory=libs --bundler=none
```

Para `database`, puedes usar Prisma, Drizzle u otro ORM, y ubicar los archivos dentro de `database/schema` y `database/seeds`.

## 🌐 Dominio y despliegue

- Dominio objetivo: `apex.novah.dev`.
- Despliegue SSR: requiere un entorno Node.js ejecutando el artefacto de `server`. Asegúrate de servir también los archivos estáticos de `browser` (esto ya lo maneja Express en el servidor compilado). La variable `PORT` define el puerto; por defecto es 4000.
- Despliegue estático: si prefieres un hosting estático, puedes publicar sólo `dist/apps/web/browser` (sin SSR). Algunas características de SEO e hidratación inicial serán diferentes sin SSR.

## 🗺️ Módulos funcionales (alto nivel)

- Atletas: perfil, métricas, progreso, PRs.
- Gimnasios: perfil, programación, comunidad.
- Ejercicios y WODs: catálogo, estándares, escalados.
- Resultados: RMs y resultados de WODs con fecha/contexto.
- Competencias: publicación, categorías, reglamento e inscripciones.

## 👥 Equipo

- **Desarrollo**: [Heiler Nova](https://github.com/heilernova)
- **Diseño**: [Heiler Nova](https://github.com/heilernova)

## 🤝 Contribución

1. Crea un branch a partir de `master`.
2. Implementa cambios con tests cuando aplique.
3. Ejecuta `npx nx lint web` y `npx nx test web` antes de abrir el PR.
4. Abre un Pull Request describiendo el alcance y cómo probarlo.

## 📄 Licencia

MIT © Propietarios del proyecto Apex

