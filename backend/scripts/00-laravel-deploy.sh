#!/usr/bin/env bash
set -e

echo "Ejecutando migraciones de Laravel…"
php artisan migrate --force

# Puedes agregar más tareas opcionales, por ejemplo:
# php artisan config:cache
# php artisan route:cache
# php artisan optimize
