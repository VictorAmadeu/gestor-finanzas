# Gestor de Finanzas

Este proyecto es una aplicaci\u00f3n b\u00e1sica para la gesti\u00f3n de finanzas personales. Incluye un backend desarrollado con **Laravel** y un frontend desarrollado con **React**.

## Objetivos del proyecto

- Registrar y administrar ingresos y gastos.
- Mostrar balances y gr\u00e1ficos de an\u00e1lisis financiero.
- Disponer de un sistema de autenticaci\u00f3n seguro con un panel principal.
- Permitir exportar datos en PDF y aplicar filtros o b\u00fasquedas avanzadas.

## Requisitos

- PHP \u2265 8.1 y Composer para el backend.
- Node.js y npm para el frontend.

## Instalaci\u00f3n r\u00e1pida

1. Clona este repositorio.
2. Instala las dependencias del backend:
   ```bash
   cd backend
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   ```
3. Instala las dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## Puesta en marcha

En terminales separadas ejecuta:

```bash
cd backend && php artisan serve
```

```bash
cd frontend && npm start
```

El frontend se iniciar\u00e1 en `http://localhost:3000` y el backend en `http://localhost:8000` por defecto.

## Estructura del repositorio

- `backend/` &mdash; API REST creada con Laravel.
- `frontend/` &mdash; interfaz de usuario en React.

## Contribuir

Las solicitudes de mejora son bienvenidas. Puedes abrir issues o pull requests para colaborar.