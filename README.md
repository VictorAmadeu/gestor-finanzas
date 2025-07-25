# Gestor de Finanzas 💸

Gestor de Finanzas es una aplicación **open source** para la gestión de finanzas personales. Está compuesta por un backend desarrollado en **Laravel** y un frontend en **React**. Su objetivo principal es que cualquier usuario pueda registrar ingresos y gastos, clasificarlos por categorías y visualizar un balance actualizado en un panel moderno y responsivo.

## 🚀 ¿Por qué existe este proyecto?

Porque tener control de tus finanzas no tiene por qué ser complicado. **Gestor de Finanzas** ofrece una solución simple pero potente para llevar un registro de tus movimientos económicos y tomar decisiones más informadas.

---

## ✨ Características principales

- **🔐 Registro e inicio de sesión**: utiliza **Supabase** para la autenticación. Los usuarios pueden crear una cuenta, iniciar sesión y restablecer su contraseña de forma segura.
- **💸 Gestión de ingresos y gastos**: añade, edita y elimina movimientos financieros. Cada movimiento incluye fecha, descripción opcional, monto y categoría.
- **🏷️ Categorías personalizadas**: organiza tus movimientos con categorías propias. Las tablas `categories`, `ingresos` y `gastos` se crean mediante migraciones de Laravel para máxima flexibilidad.
- **📊 Panel de control moderno**: muestra tus movimientos más recientes y un resumen visual de ingresos, gastos y balance. Calcula el total de ingresos/gastos y los muestra en verde o rojo para una lectura rápida.
- **⚡ Caché en el navegador**: usa `localStorage` para mostrar instantáneamente los movimientos guardados y sincronizarlos después con el backend.
- **🔗 API RESTful**: el backend expone endpoints para gestionar ingresos, gastos y categorías (**GET**, **POST**, **PUT** y **DELETE**). Las rutas siguen el patrón `/api/ingresos`, `/api/gastos` y `/api/categories`.
- **💻 Interfaz moderna**: desarrollada con **React**, **Tailwind CSS** y **Heroicons**. Tailwind permite personalizar colores de botones (azul para primarios, morado secundarios, verde para éxitos, rojo para acciones peligrosas).
- **🛠️ Fácil despliegue**: usa **SQLite** por defecto para facilitar la puesta en marcha, aunque puedes configurar cualquier base de datos soportada por Laravel.
- **🚧 Preparado para mejoras**: el roadmap incluye funcionalidades futuras como exportación de tablas a PDF y filtrado/búsqueda avanzada.

---

## 🧰 Tecnologías utilizadas

| Capa         | Tecnologías/Paquetes principales                                                                                  |
|--------------|------------------------------------------------------------------------------------------------------------------|
| **Backend**  | PHP 8.2, Laravel 11 (framework), SQLite/MySQL/PostgreSQL (según `.env`), Composer para dependencias. Usa migraciones para las tablas `users`, `categories`, `ingresos` y `gastos`. |
| **Frontend** | React 19 (Create React App), React Router para rutas, Tailwind CSS con paleta de colores personalizada, Heroicons para iconos, Supabase JS para autenticación.                |
| **Autenticación** | Supabase (Auth) — se inicializa con variables `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_KEY`.                                                   |
| **Herramientas adicionales** | Vite (Laravel) para compilación de assets, npm para el frontend, PHPUnit/Pest para pruebas en el backend, ESLint y Testing Library para el frontend.           |

---

## 📦 Estructura del repositorio

```
gestor-finanzas/
├── backend/                # API REST (Laravel)
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/  # Controladores: GastoController, IngresoController, CategoryController
│   │   └── Models/         # Modelos: Gasto, Ingreso, Category, User
│   ├── database/
│   │   ├── migrations/      # Migraciones para users, categorias, ingresos, gastos
│   │   ├── factories/
│   │   └── seeders/
│   ├── config/             # Configuraciones (app.php, auth.php, queue.php, etc.)
│   ├── routes/
│   │   ├── api.php         # Define las rutas de la API
│   │   └── web.php         # Rutas web (no utilizadas en este proyecto)
│   ├── tests/              # Pruebas de Laravel
│   ├── vite.config.js      # Configuración de Vite
│   └── .env.example        # Variables de entorno de ejemplo
├── frontend/               # Interfaz de usuario (React)
│   ├── public/
│   ├── src/
│   │   ├── pages/          # Vistas: LoginPage, RegisterPage, DashboardPage
│   │   ├── components/     # Componentes reutilizables: Header, Footer, MovimientoForm
│   │   ├── context/        # Contexto de autenticación (AuthContext)
│   │   ├── services/       # Cliente de Supabase
│   │   └── index.js        # Punto de entrada de React
│   ├── tailwind.config.js  # Configuración de Tailwind
│   ├── package.json        # Dependencias del frontend
│   └── .env.example        # Variables de entorno de ejemplo para Supabase
└── README.md               # Este archivo
```
---

## 🗄️ Modelo de datos

La base de datos cuenta con cuatro tablas principales:

| Tabla        | Campos principales (simplificado)                       | Descripción                                                                                      |
|--------------|--------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `users`      | `id` (UUID), `name`, `email`, `password`, `created_at` | Usuarios registrados. La contraseña puede ser `null` si toda la autenticación se gestiona con Supabase. |
| `categories` | `id`, `nombre`, `created_at`                           | Categorías de movimientos (ej.: Alimentación, Transporte).                                       |
| `ingresos`   | `id`, `user_id` (UUID), `monto`, `fecha`, `descripcion`, `category_id` | Registra los ingresos del usuario. La relación con `categories` es opcional.                     |
| `gastos`     | `id`, `user_id` (UUID), `monto`, `fecha`, `descripcion`, `category_id` | Registra los gastos del usuario. Igual que en ingresos, la categoría es opcional.                |

---

## 🏗️ Configuración y puesta en marcha

### 1. Pre-requisitos

- **PHP 8.1 o superior** y Composer.
- **Node.js** y **npm**.
- Una cuenta de **Supabase** para la autenticación.

---

### 2. Clonar el repositorio

```
git clone https://github.com/VictorAmadeu/gestor-finanzas.git
cd gestor-finanzas
```
---

### 3. Configuración del backend

```
cd backend
composer install          # instala dependencias de PHP
npm install               # instala paquetes para Vite/Tailwind
cp .env.example .env      # crea el archivo de entorno
php artisan key:generate  # genera la clave de la aplicación ```

Por defecto se utiliza **SQLite**: crea el archivo `database/database.sqlite` si no existe y configura `DB_CONNECTION=sqlite` en `.env`.

**Ejecuta las migraciones para crear las tablas:**

```
php artisan migrate
```
---

### 4. Configuración del frontend

```
cd ../frontend
npm install              # instala dependencias de React
cp .env.example .env     # copia el ejemplo de variables

Abre `.env` y añade tus credenciales de Supabase:

```
REACT_APP_SUPABASE_URL=https://xxxxxxxx.supabase.co
REACT_APP_SUPABASE_KEY=tu-clave-anónima

>  Estas variables son leídas por supabaseClient.js.

---

### 5. Ejecución

**Inicia el backend:**
```
cd backend
php artisan serve

> En otra terminal, inicia el frontend:
``` 
cd frontend
npm start

> Por defecto, el backend se ejecuta en http://localhost:8000 y el frontend en http://localhost:3000.

---

## 🔌 Endpoints de la API (resumen)

| Método | Ruta                                   | Descripción                                                                             |
|--------|----------------------------------------|-----------------------------------------------------------------------------------------|
| GET    | `/api/ingresos?user_id={uuid}`         | Obtiene todos los ingresos del usuario.                                                 |
| POST   | `/api/ingresos`                        | Crea un ingreso (requiere `user_id`, `monto`, `fecha` y opcional `descripcion` y `category_id`). |
| PUT    | `/api/ingresos/{id}`                   | Actualiza un ingreso existente.                                                         |
| DELETE | `/api/ingresos/{id}`                   | Elimina un ingreso.                                                                     |
| GET    | `/api/gastos?user_id={uuid}`           | Obtiene todos los gastos del usuario.                                                   |
| POST   | `/api/gastos`                          | Crea un gasto.                                                                          |
| PUT    | `/api/gastos/{id}`                     | Actualiza un gasto.                                                                     |
| DELETE | `/api/gastos/{id}`                     | Elimina un gasto.                                                                       |
| GET    | `/api/categories`                      | Lista todas las categorías.                                                             |

> Todos los endpoints devuelven/aceptan **JSON**.  
> Es necesario enviar la cabecera `Content-Type: application/json` en las peticiones **POST** y **PUT**.

---

## 🖥️ Guía de uso rápido

1. Visita [http://localhost:3000](http://localhost:3000) en tu navegador.

2. **Crear una cuenta:**  
   Desde la página de registro introduce nombre, correo y contraseña; los datos se envían a Supabase.

3. **Iniciar sesión:**  
   Utiliza tu correo y contraseña; puedes recuperar la contraseña si la olvidas.

4. **Dashboard:**
   - En la vista principal verás un resumen de ingresos, gastos y balance.
   - Añade ingresos o gastos mediante los botones “Añadir Ingreso” y “Añadir Gasto”.
   - Completa el formulario con fecha, monto y categoría; el componente `MovimientoForm` construye un objeto con dichos datos y lo envía.
   - Edita o elimina movimientos existentes utilizando los iconos de edición o borrado.
   - Cierra sesión con el botón “Cerrar sesión”, que limpia el almacenamiento local y utiliza `supabase.auth.signOut()`.

5. **Categorías:**  
   Se cargan automáticamente desde el backend; en futuras versiones se permitirá su gestión completa.

---

## 🤝 Contribuciones

Las contribuciones son **bienvenidas**. Puedes ayudar de las siguientes maneras:

- Reportar errores mediante issues.
- Enviar mejoras en la interfaz, rendimiento o seguridad.
- Implementar funcionalidades pendientes (exportación a PDF, filtros avanzados, categorías de usuario, soporte multi-moneda, etc.).
- Escribir pruebas unitarias para el backend o frontend.

Para colaborar, bifurca el repositorio, crea una rama con tu mejora y abre un pull request.  
Consulta las directrices de Laravel para contribuir al framework si necesitas inspiración.

---

## 📄 Licencia y autoría

Este proyecto se publica bajo la **Licencia MIT**, la misma utilizada por Laravel.  
Puedes usarlo y modificarlo libremente, siempre que mantengas los avisos de copyright.

Desarrollado con 💻 y ☕ por **Victor Amadeu Braga Heleno**.  
Para contactar o conocer más proyectos, visita el portafolio enlazado en el pie de la aplicación o el perfil de GitHub.

---

