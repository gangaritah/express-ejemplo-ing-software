# Helper Scripts

## `challenges.md`

# Retos para Estudiantes - Gestor de Nómina

Bienvenido a la aplicación de Gestor de Nómina. Este proyecto ha sido diseñado para que practiques conceptos clave de desarrollo backend. A continuación, encontrarás tres retos para mejorar la aplicación.

## Reto 1: Implementar Hashing de Contraseñas (Seguridad)

**Nivel:** Intermedio

Actualmente, el sistema almacena las contraseñas en texto plano, lo cual es una **muy mala práctica de seguridad**.

**Tu tarea:**
1.  Instala la librería `bcryptjs` y sus tipos.
2.  Modifica el modelo `User` o usa un hook de Sequelize (`beforeCreate`) para hashear la contraseña antes de guardarla en la base de datos.
3.  Actualiza el servicio de autenticación `AuthService` para que al hacer login, compare la contraseña ingresada con el hash guardado usando `bcrypt.compare`.
4.  Actualiza el script `src/sync.ts` para que el usuario admin inicial se cree con una contraseña hasheada.

## Reto 2: Rol de Auditor (Control de Acceso)

**Nivel:** Fácil

La aplicación tiene dos roles: `admin` y `employee_recursos_humanos`. Se requiere un nuevo rol `auditor` que pueda ver la información pero **no pueda hacer cambios**.

**Tu tarea:**
1.  Agrega el valor 'auditor' al ENUM de roles en el modelo `User`.
2.  Crea un middleware nuevo `checkRole.ts` que reciba un array de roles permitidos.
3.  Aplica este middleware en las rutas:
    -   El auditor puede acceder a `GET /employees` y `GET /payrolls`.
    -   El auditor **NO** puede acceder a `POST /employees` ni `POST /payrolls/generate`.

## Reto 3: Paginación de Empleados (Optimización)

**Nivel:** Intermedio

Si la empresa tiene 1000 empleados, traerlos todos de una vez (`findAll`) será muy lento.

**Tu tarea:**
1.  Modifica el repositorio `EmployeeRepository` y la capa de servicio para aceptar parámetros `page` y `limit`.
2.  Usa `offset` y `limit` en la consulta de Sequelize.
3.  Actualiza el controlador para leer estos parámetros del `query string` (ej: `GET /employees?page=1&limit=10`).
4.  Devuelve un objeto con la data y la metadata (total de items, total de páginas).

¡Buena suerte!
