
# Apex

Aplicación web para atletas de diversas disciplinas (CrossFit, Running, etc.) que permite registrar avances, rutinas y compartir logros en comunidad.

## Descripción
Apex ayuda a los usuarios a llevar un registro detallado de sus ejercicios, facilitando el seguimiento del progreso y el establecimiento de nuevas metas.

## Características
- Comunidad de usuarios para compartir logros y motivación.
- Registro de ejercicios y rutinas personalizadas.

## Tecnologías utilizadas
- PostgreSQL: Base de datos para la gestión de los datos.
- NestJS: API desarrollada en Node.js.
- Angular: Sitio web desarrollado en Angular.
- Nx: Controlador del monorepositorio.

## Estructura del proyecto

```
apps/
    api/        # API en Nestjs
	web/        # Aplicación web Angular
packages/       # Librerías compartidas (si existen)
    core/       # Código compartido tanto en frontend con el backend
```

## Instalación y uso rápido

Requisitos previos:
- Node.js >= 18
- Nx CLI (`npm install -g nx`)

Instalación:
```bash
git clone https://github.com/tu-usuario/apex.git
cd apex
npm install
```

Ejecutar la app web:
```bash
npx nx serve web
```

Ejecutar pruebas:
```bash
npx nx test web
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor:
- Abre un issue para sugerencias o reportar bugs.
- Haz un fork y envía un pull request siguiendo las convenciones del proyecto.

## Enlaces útiles
- [Nx Documentation](https://nx.dev/)
- [Angular](https://angular.dev/)
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Licencia

Este proyecto está bajo la licencia MIT.