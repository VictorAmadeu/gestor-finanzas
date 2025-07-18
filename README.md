# Gestor de Finanzas

Este proyecto es una aplicación para la gestión de finanzas personales. Incluye un backend desarrollado con **Laravel** y un frontend desarrollado con **React**.

## Objetivos del proyecto

- Registrar y administrar ingresos y gastos.
- Mostrar balances y un análisis financiero.
- Disponer de un sistema de autenticación seguro con un panel principal.
- Permitir exportar datos en PDF y aplicar filtros o búsquedas avanzadas.

## Requisitos

- PHP 8.1 y Composer para el backend.
- Node.js y npm para el frontend.

## Instalación rápida

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

El frontend se iniciará en `http://localhost:3000` y el backend en `http://localhost:8000` por defecto.

## Estructura del repositorio

- `backend/` &mdash; API REST creada con Laravel.
- `frontend/` &mdash; interfaz de usuario en React.

## Contribuir

Las solicitudes de mejora son bienvenidas. Puedes abrir issues o pull requests para colaborar.
