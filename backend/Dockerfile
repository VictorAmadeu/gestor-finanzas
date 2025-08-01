# Usa una imagen base que ya incluye PHP-FPM y Nginx
FROM richarvey/nginx-php-fpm:3.1.6

# Define el directorio de trabajo (por defecto es /var/www/html)
WORKDIR /var/www/html

# Copia el código del backend al contenedor
COPY . /var/www/html

# Instala dependencias del sistema necesarias (aquí Node para Vite si fuera necesario)
RUN apk update && apk add --no-cache npm

# Instala las dependencias de Laravel en modo producción (Composer ya viene en la imagen)
RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

# Instala dependencias de Node para compilar assets (opcional)
RUN npm install --prefix /var/www/html

# Compila los assets de frontend (opcional, si este backend sirviera vistas; para APIs puras no es crítico)
RUN npm run build --prefix /var/www/html || echo "Vite no está configurado, saltando…"

# Copia los scripts de despliegue (los crearás en el siguiente paso)
COPY scripts/ /var/www/html/scripts/

# Expón el puerto 80 (Nginx escucha aquí)
EXPOSE 80

# El comando de inicio lo gestiona la imagen base a través de /start.sh
CMD ["/start.sh"]
