# Guía del Proyecto: Gestor de Nómina
## Aplicación Educativa para Desarrollo Backend

---

# 1. Introducción

## ¿Qué es este proyecto?

Este proyecto es una aplicación web de gestión de nómina (payroll management) diseñada específicamente para fines educativos. Su objetivo principal es enseñar conceptos fundamentales del desarrollo backend moderno utilizando tecnologías populares en la industria.

## Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Entorno de ejecución JavaScript del lado del servidor |
| **Express.js** | Framework web para crear APIs RESTful |
| **TypeScript** | Superset de JavaScript con tipado estático |
| **PostgreSQL** | Base de datos relacional |
| **Sequelize** | ORM (Object-Relational Mapping) para Node.js |
| **JWT** | JSON Web Tokens para autenticación |
| **Docker** | Contenedorización de la aplicación |
| **HTML/CSS/JS** | Frontend simple sin frameworks |

---

# 2. Arquitectura del Proyecto

## Estructura de Carpetas

```
app-ejemplo-express/
├── src/                          # Código fuente del backend
│   ├── config/
│   │   └── database.ts           # Configuración de Sequelize
│   ├── controllers/              # Controladores (manejan HTTP)
│   │   ├── AuthController.ts
│   │   ├── EmployeeController.ts
│   │   └── PayrollController.ts
│   ├── services/                 # Lógica de negocio
│   │   ├── AuthService.ts
│   │   ├── EmployeeService.ts
│   │   └── PayrollService.ts
│   ├── repositories/             # Acceso a datos
│   │   ├── UserRepository.ts
│   │   ├── EmployeeRepository.ts
│   │   └── PayrollRepository.ts
│   ├── models/                   # Modelos de Sequelize
│   │   ├── User.ts
│   │   ├── Employee.ts
│   │   └── Payroll.ts
│   ├── middleware/               # Middleware de Express
│   │   └── auth.ts
│   ├── routes/                   # Definición de rutas
│   │   └── index.ts
│   ├── utils/                    # Utilidades
│   │   └── fileUpload.ts
│   ├── index.ts                  # Punto de entrada
│   └── sync.ts                   # Script de sincronización DB
├── frontend/                     # Código del frontend
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── login.js
│   │   └── dashboard.js
│   ├── index.html
│   └── dashboard.html
├── uploads/                      # Carpeta para imágenes
├── docker-compose.yml            # Configuración de Docker
├── Dockerfile                    # Imagen de Docker
├── package.json
├── tsconfig.json
└── .env                          # Variables de entorno
```

## Patrón de Arquitectura: Controller-Service-Repository

Esta aplicación implementa un patrón de capas que separa las responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│                   (Navegador Web)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLERS                             │
│  - Reciben peticiones HTTP                                  │
│  - Validan datos de entrada                                 │
│  - Llaman a los servicios                                   │
│  - Envían respuestas HTTP                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES                               │
│  - Contienen la lógica de negocio                          │
│  - Coordinan operaciones complejas                          │
│  - Son independientes del protocolo HTTP                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORIES                             │
│  - Acceden directamente a la base de datos                  │
│  - Usan Sequelize para las operaciones CRUD                 │
│  - Abstraen los detalles de la base de datos               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│                    (PostgreSQL)                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 3. Modelo de Datos

## Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER       │       │    EMPLOYEE     │       │    PAYROLL      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │◄──────│ id (PK)         │
│ username        │       │ name            │   1:N │ employeeId (FK) │
│ password        │       │ salary          │       │ date            │
│ role            │       │ photoUrl        │       │ amount          │
└─────────────────┘       └─────────────────┘       │ status          │
                                                    └─────────────────┘
```

## Descripción de las Tablas

### User (Usuarios del sistema)
- **id**: Identificador único
- **username**: Nombre de usuario para login
- **password**: Contraseña (¡en producción debe estar hasheada!)
- **role**: Rol del usuario ('admin' o 'employee_recursos_humanos')

### Employee (Empleados de la empresa)
- **id**: Identificador único
- **name**: Nombre del empleado
- **salary**: Salario mensual
- **photoUrl**: URL de la foto del empleado

### Payroll (Registros de nómina)
- **id**: Identificador único
- **employeeId**: Referencia al empleado (clave foránea)
- **date**: Fecha de generación
- **amount**: Monto pagado
- **status**: Estado ('pending' o 'paid')

---

# 4. API Endpoints

## Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/login` | Iniciar sesión | No |

**Ejemplo de petición:**
```json
POST /api/login
{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Empleados

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/employees` | Obtener todos los empleados | Sí (JWT) |
| POST | `/api/employees` | Crear un empleado | Sí (JWT) |

## Nómina

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/payrolls` | Obtener todos los registros | Sí (JWT) |
| POST | `/api/payrolls/generate` | Generar nómina para empleados | Sí (JWT) |

---

# 5. Conceptos Clave Demostrados

## 5.1 Autenticación con JWT

JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre partes.

**Flujo de autenticación:**
1. El usuario envía credenciales (username/password)
2. El servidor valida y genera un token JWT
3. El cliente guarda el token (localStorage)
4. En cada petición, el cliente envía el token en el header `Authorization`

**Código del middleware de autenticación:**
```typescript
// src/middleware/auth.ts
export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate' });
    }
    req.user = decoded;
    next();
  });
};
```

## 5.2 Manejo de Concurrencia con Promise.all

Cuando necesitamos procesar múltiples operaciones asíncronas, `Promise.all` permite ejecutarlas en paralelo:

```typescript
// src/services/PayrollService.ts
async generatePayrollForBatch(employeeIds: number[]) {
  const results = await Promise.all(employeeIds.map(async (id) => {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) return null;
    
    return await this.payrollRepository.create({
      employeeId: id,
      amount: employee.salary,
      status: 'pending'
    });
  }));
  
  return results.filter(p => p !== null);
}
```

## 5.3 Subida de Archivos con Multer

Multer es un middleware para manejar `multipart/form-data`:

```typescript
// src/utils/fileUpload.ts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
```

## 5.4 ORM con Sequelize

Sequelize permite definir modelos que se mapean a tablas:

```typescript
// src/models/Employee.ts
class Employee extends Model {
  public id!: number;
  public name!: string;
  public salary!: number;
  public photoUrl!: string;
}

Employee.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.FLOAT, allowNull: false },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, tableName: 'employees' });
```

---

# 6. Docker y Contenedorización

## ¿Qué es Docker?

Docker permite empaquetar aplicaciones con todas sus dependencias en "contenedores" que pueden ejecutarse en cualquier sistema.

## Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx ts-node src/sync.ts && node dist/index.js"]
```

## Docker Compose

Permite definir y ejecutar múltiples contenedores:

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: payroll_db
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d payroll_db"]
      
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
```

## Comandos Docker Esenciales

```bash
# Construir y levantar contenedores
docker compose up --build -d

# Ver logs
docker logs payroll_app

# Detener contenedores
docker compose down

# Ver tablas en la base de datos
docker exec -it payroll_db psql -U admin -d payroll_db -c "\dt"
```

---

# Apéndice A: Referencia de Comandos Node.js y NPM

## Verificación de Instalación

```bash
# Verificar versión de Node.js
node -v
node --version

# Verificar versión de NPM
npm -v
npm --version

# Ver ubicación de Node.js instalado
which node
```

## Inicialización de Proyectos

```bash
# Inicializar proyecto (interactivo)
npm init

# Inicializar proyecto con valores por defecto
npm init -y

# Crear archivo package.json personalizado
npm init --scope=@mi-organizacion
```

## Gestión de Dependencias

```bash
# Instalar todas las dependencias del package.json
npm install
npm i

# Instalar paquete como dependencia de producción
npm install express
npm i express

# Instalar paquete como dependencia de desarrollo
npm install --save-dev typescript
npm i -D typescript

# Instalar paquete globalmente
npm install -g nodemon
npm i -g nodemon

# Instalar versión específica
npm install express@4.18.0

# Instalar la última versión
npm install express@latest

# Desinstalar paquete
npm uninstall express
npm remove express
npm rm express

# Actualizar paquetes
npm update
npm update express

# Ver paquetes desactualizados
npm outdated

# Ver árbol de dependencias
npm list
npm ls
npm list --depth=0
```

## Scripts de NPM

```bash
# Ejecutar script definido en package.json
npm run start
npm run build
npm run dev
npm run test

# Atajos para scripts comunes
npm start      # equivale a npm run start
npm test       # equivale a npm run test

# Ver scripts disponibles
npm run
```

## Ejecución de Código

```bash
# Ejecutar archivo JavaScript
node archivo.js

# Ejecutar con ts-node (TypeScript)
npx ts-node archivo.ts

# Ejecutar archivo y pasar argumentos
node script.js arg1 arg2

# Ejecutar en modo REPL (consola interactiva)
node

# Ejecutar con variables de entorno
NODE_ENV=production node app.js
PORT=4000 node app.js

# Ejecutar con inspector/debugger
node --inspect app.js
node --inspect-brk app.js
```

## NPX - Ejecutar Paquetes sin Instalar

```bash
# Ejecutar paquete sin instalarlo globalmente
npx create-react-app mi-app
npx ts-node script.ts
npx nodemon src/index.ts

# Ejecutar versión específica
npx express-generator@4
```

## Gestión de Caché y Limpieza

```bash
# Limpiar caché de NPM
npm cache clean --force

# Verificar integridad del caché
npm cache verify

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install

# Eliminar package-lock.json y reinstalar
rm package-lock.json
npm install
```

## Información y Diagnóstico

```bash
# Ver configuración de NPM
npm config list

# Ver información de un paquete
npm info express
npm view express

# Buscar paquetes
npm search express

# Ver paquetes instalados globalmente
npm list -g --depth=0

# Auditar vulnerabilidades de seguridad
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix
npm audit fix --force
```

## Scripts Comunes en package.json

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "clean": "rm -rf dist",
    "prepare": "npm run build"
  }
}
```

---

# Apéndice B: Referencia de Comandos Docker

## Verificación de Instalación

```bash
# Verificar versión de Docker
docker --version
docker version

# Verificar estado del daemon
docker info

# Verificar versión de Docker Compose
docker compose version
```

## Gestión de Imágenes

```bash
# Listar imágenes locales
docker images
docker image ls

# Descargar imagen de Docker Hub
docker pull postgres:15
docker pull node:18-alpine

# Construir imagen desde Dockerfile
docker build -t mi-app .
docker build -t mi-app:v1.0 .
docker build -f Dockerfile.prod -t mi-app:prod .

# Eliminar imagen
docker rmi postgres:15
docker image rm postgres:15

# Eliminar imágenes sin usar
docker image prune
docker image prune -a

# Ver historial de una imagen
docker history postgres:15

# Etiquetar imagen
docker tag mi-app:latest mi-app:v2.0

# Subir imagen a Docker Hub
docker push usuario/mi-app:latest

# Guardar imagen como archivo
docker save -o mi-app.tar mi-app:latest

# Cargar imagen desde archivo
docker load -i mi-app.tar
```

## Gestión de Contenedores

```bash
# Listar contenedores en ejecución
docker ps

# Listar todos los contenedores (incluyendo detenidos)
docker ps -a

# Crear y ejecutar contenedor
docker run postgres:15
docker run -d postgres:15                    # en segundo plano (detached)
docker run -p 5432:5432 postgres:15          # mapear puertos
docker run --name mi_postgres postgres:15    # nombrar contenedor
docker run -v /data:/var/lib/postgresql/data postgres:15  # montar volumen
docker run -e POSTGRES_PASSWORD=pass postgres:15          # variable de entorno
docker run --rm postgres:15                  # eliminar al detenerse

# Ejemplo completo
docker run -d \
  --name payroll_db \
  -p 5432:5432 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=payroll_db \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# Iniciar contenedor detenido
docker start payroll_db

# Detener contenedor
docker stop payroll_db

# Reiniciar contenedor
docker restart payroll_db

# Eliminar contenedor
docker rm payroll_db
docker rm -f payroll_db    # forzar eliminación

# Eliminar todos los contenedores detenidos
docker container prune

# Pausar/reanudar contenedor
docker pause payroll_db
docker unpause payroll_db
```

## Logs y Monitoreo

```bash
# Ver logs de un contenedor
docker logs payroll_app

# Seguir logs en tiempo real
docker logs -f payroll_app

# Ver últimas N líneas
docker logs --tail 100 payroll_app

# Ver logs con timestamps
docker logs -t payroll_app

# Ver estadísticas de uso (CPU, memoria)
docker stats

# Ver estadísticas de un contenedor específico
docker stats payroll_app

# Inspeccionar contenedor (detalles JSON)
docker inspect payroll_app

# Ver puertos mapeados
docker port payroll_app

# Ver procesos dentro del contenedor
docker top payroll_app
```

## Ejecutar Comandos en Contenedores

```bash
# Ejecutar comando en contenedor en ejecución
docker exec payroll_db ls -la

# Abrir shell interactivo (bash)
docker exec -it payroll_db bash

# Abrir shell en Alpine Linux (sh)
docker exec -it payroll_app sh

# Ejecutar como usuario específico
docker exec -u postgres payroll_db whoami

# Ejecutar con variables de entorno
docker exec -e MI_VAR=valor payroll_app env

# Conectar a PostgreSQL
docker exec -it payroll_db psql -U admin -d payroll_db
```

## Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Crear volumen
docker volume create postgres_data

# Inspeccionar volumen
docker volume inspect postgres_data

# Eliminar volumen
docker volume rm postgres_data

# Eliminar volúmenes sin usar
docker volume prune
```

## Gestión de Redes

```bash
# Listar redes
docker network ls

# Crear red
docker network create mi_red

# Inspeccionar red
docker network inspect bridge

# Conectar contenedor a red
docker network connect mi_red payroll_app

# Desconectar contenedor de red
docker network disconnect mi_red payroll_app

# Eliminar red
docker network rm mi_red
```

## Limpieza General

```bash
# Eliminar TODO lo no utilizado (contenedores, imágenes, redes, volúmenes)
docker system prune -a --volumes

# Ver uso de disco
docker system df
```

---

# Apéndice C: Referencia de Docker Compose

## Comandos Básicos

```bash
# Construir imágenes
docker compose build

# Construir sin usar caché
docker compose build --no-cache

# Levantar servicios
docker compose up

# Levantar en segundo plano
docker compose up -d

# Construir y levantar
docker compose up --build

# Levantar servicio específico
docker compose up -d db

# Detener servicios
docker compose stop

# Detener y eliminar contenedores
docker compose down

# Eliminar también volúmenes
docker compose down -v

# Eliminar también imágenes
docker compose down --rmi all
```

## Logs y Monitoreo

```bash
# Ver logs de todos los servicios
docker compose logs

# Seguir logs en tiempo real
docker compose logs -f

# Logs de servicio específico
docker compose logs app
docker compose logs -f db

# Últimas N líneas
docker compose logs --tail 50
```

## Gestión de Servicios

```bash
# Reiniciar servicios
docker compose restart

# Reiniciar servicio específico
docker compose restart app

# Ver estado de servicios
docker compose ps

# Escalar servicio (múltiples réplicas)
docker compose up -d --scale app=3

# Ejecutar comando en servicio
docker compose exec db psql -U admin -d payroll_db

# Ejecutar comando único (contenedor temporal)
docker compose run --rm app npm test
```

## Archivos de Configuración

```bash
# Usar archivo compose alternativo
docker compose -f docker-compose.prod.yml up

# Usar múltiples archivos (se combinan)
docker compose -f docker-compose.yml -f docker-compose.override.yml up

# Validar archivo compose
docker compose config

# Ver configuración procesada
docker compose config --services
docker compose config --volumes
```

## Ejemplo Completo docker-compose.yml

```yaml
services:
  # Servicio de base de datos
  db:
    image: postgres:15
    container_name: payroll_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: payroll_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d payroll_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  # Servicio de aplicación
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: payroll_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: db
      DB_USER: admin
      DB_PASSWORD: password
      DB_NAME: payroll_db
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./uploads:/usr/src/app/uploads
    networks:
      - app_network

  # Servicio de Redis (ejemplo adicional)
  redis:
    image: redis:alpine
    container_name: payroll_redis
    ports:
      - "6379:6379"
    networks:
      - app_network

# Definición de volúmenes
volumes:
  postgres_data:

# Definición de redes
networks:
  app_network:
    driver: bridge
```

## Variables de Entorno con .env

```bash
# Archivo .env
POSTGRES_USER=admin
POSTGRES_PASSWORD=secreto123
DB_NAME=mi_base_datos
```

```yaml
# docker-compose.yml
services:
  db:
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
```

---

# 7. Instrucciones de Instalación

## Prerrequisitos

- Node.js v16 o superior
- Docker y Docker Compose
- Git (opcional)

## Pasos

1. **Clonar o descargar el proyecto**

2. **Levantar la base de datos y el backend:**
```bash
docker compose up --build -d
```

3. **Verificar los logs:**
```bash
docker logs payroll_app
```

Deberías ver:
```
📦 Loading models: User Employee Payroll
✅ Database connected!
✅ Database synced!
🚀 Server running on port 3000
```

4. **Abrir el frontend:**
   - Usa Live Server en VS Code o cualquier servidor estático
   - Abre `frontend/index.html`
   - Inicia sesión con: `admin` / `password123`

---

# 8. Retos para Estudiantes

## Reto 1: Implementar Hashing de Contraseñas (Seguridad)

**Problema:** Las contraseñas se guardan en texto plano.

**Tarea:**
1. Usar `bcrypt` para hashear contraseñas antes de guardarlas
2. Modificar el login para comparar usando `bcrypt.compare()`

## Reto 2: Rol de Auditor (Control de Acceso)

**Problema:** Solo existen 'admin' y 'employee_recursos_humanos'.

**Tarea:**
1. Agregar rol 'auditor' al modelo User
2. Crear middleware `checkRole()` que restrinja acceso
3. Auditor solo puede ver, no modificar

## Reto 3: Paginación de Empleados

**Problema:** `findAll()` trae todos los registros a la vez.

**Tarea:**
1. Aceptar parámetros `page` y `limit` en la ruta `/employees`
2. Usar `offset` y `limit` en Sequelize
3. Devolver metadata con total de páginas

---

# 9. Glosario

| Término | Definición |
|---------|------------|
| **API** | Interfaz de Programación de Aplicaciones |
| **REST** | Estilo arquitectónico para APIs basado en recursos |
| **JWT** | Token de autenticación codificado en JSON |
| **ORM** | Herramienta que mapea objetos a tablas de base de datos |
| **Middleware** | Función que intercepta peticiones antes del controlador |
| **CORS** | Política que permite peticiones entre dominios diferentes |
| **Docker** | Plataforma de contenedorización de aplicaciones |

---

# 10. Referencias

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Documentación de Docker](https://docs.docker.com/)
- [JWT.io](https://jwt.io/)

---

**Universidad EAM - Electiva 3 (2026)**
*Curso de Programación Backend*
