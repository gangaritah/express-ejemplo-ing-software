# Helper Scripts

## `README.md`

# Gestor de Nómina - App Educativa

Esta es una aplicación de ejemplo para un curso de programación backend. Es un gestor de nómina básico construido con Node.js, Express, TypeScript, Sequelize y PostgreSQL.

## Requisitos Previos

-   Node.js (v16 o superior)
-   Docker y Docker Compose

## Configuración e Instalación

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Levantar la base de datos:**
    ```bash
    docker-compose up -d
    ```

3.  **Configurar variables de entorno:**
    El archivo `.env` ya viene pre-configurado para el entorno de desarrollo local con Docker.

4.  **Iniciar la aplicación (Modo Desarrollo):**
    Esto iniciará el servidor y sincronizará la base de datos (creando tablas y usuario admin por defecto).
    ```bash
    npm run dev
    ```

5.  **Acceder a la aplicación:**
    Abre tu navegador en `http://localhost:3000`.

## Credenciales por Defecto

-   **Usuario:** `admin`
-   **Contraseña:** `password123`

## Estructura del Proyecto

-   `src/`: Código fuente del backend.
    -   `config/`: Configuración de base de datos.
    -   `controllers/`: Controladores de las rutas.
    -   `models/`: Modelos de datos (Sequelize).
    -   `repositories/`: Capa de acceso a datos.
    -   `services/`: Lógica de negocio.
    -   `middleware/`: Middleware de autenticación y manejo de errores.
    -   `routes/`: Definición de rutas de la API.
-   `frontend/`: Código fuente del frontend (HTML/JS/CSS plano).
-   `uploads/`: Carpeta para almacenamiento de imágenes.

## Retos

Revisa el archivo `challenges.md` para ver los ejercicios propuestos para mejorar esta aplicación.
