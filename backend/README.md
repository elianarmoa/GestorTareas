
# 🧠 Task Manager API - Backend

Este es el backend de una aplicación Full Stack diseñada para la gestión eficiente de tareas. Desarrollado como el Proyecto Final del curso **Backend Developer - Módulo II** en la Facultad de Ingeniería de la UNMDP, este servicio RESTful utiliza un stack de tecnologías modernas como Node.js, Express y MongoDB. Está completamente preparado para integrarse con un frontend desarrollado en React y cumple con todos los requisitos académicos.

---

## 🚀 Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework web para Node.js, utilizado para construir la API.
- **MongoDB**: Base de datos NoSQL, para almacenar la información de tareas, usuarios y categorías.
- **Mongoose**: ODM para MongoDB en Node.js, facilitando la interacción con la base de datos.
- **dotenv**: Para gestionar variables de entorno de forma segura.
- **cors**: Middleware para habilitar Cross-Origin Resource Sharing.
- **jsonwebtoken**: Para la generación y verificación de JWT para la autenticación.
- **bcryptjs**: Para el hashing seguro de contraseñas.
- **swagger-ui-express**: Middleware para servir la documentación interactiva de la API (Swagger UI).
- **nodemon**: Herramienta de desarrollo para el reinicio automático del servidor.

---

## 📦 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/elianarmoa/GestorTareas.git
cd GestorTareas/backend
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz de la carpeta backend (al mismo nivel que `package.json`).

Puedes usar el archivo `.env.example` como plantilla:

```env
# .env 
PORT=3000
MONGO_URI="mongodb+srv://<db_username>:<db_password>@taskmanager.2wopacw.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager"
JWT_SECRET=miclavesecreta123
```

- Reemplaza `<db_username>` y `<db_password>` por tus credenciales reales.
- Asegúrate de habilitar tu IP en MongoDB Atlas (o usar `0.0.0.0/0` en desarrollo).
- El secreto JWT debe ser fuerte y único.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar el servidor

```bash
npm run dev
```

- El servidor se ejecutará en `http://localhost:3000`
- Swagger UI: `http://localhost:3000/public-api`

---

## 📝 Notas importantes

### Script para crear usuario administrador:

```bash
npm run create-admin
```

Esto creará un usuario:

```
Usuario: Administrador
Contraseña: 123456
```

### Prueba del login:

```json
POST /api/users/login
{
  "username": "Administrador",
  "password": "123456"
}
```

El token JWT obtenido te permitirá acceder a rutas protegidas como `GET /api/users`.

---

## 📁 Estructura del proyecto

```
backend/
├── controllers/
│   ├── categoryController.js
│   ├── taskController.js
│   └── userController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── Category.js
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── categoryRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── createAdmin.js
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── swagger.json
```

---

## 🧠 Funcionalidades de la API

### Autenticación:
- Registro de nuevos usuarios.
- Login con generación de JWT.
- Contraseñas encriptadas con bcryptjs.

### Usuarios (solo admin):
- Obtener todos los usuarios registrados.

### Tareas:
- Crear tareas
- Listar tareas por usuario
- Marcar como completadas/incompletas
- Eliminar tareas

### Categorías:
- Crear, listar, actualizar, eliminar (solo admin para PATCH/DELETE)

---

## 📋 Endpoints destacados

### Usuarios (`/api/users`)
| Método | Ruta        | Descripción                    | Token | Rol     |
|--------|-------------|--------------------------------|-------|---------|
| POST   | /register   | Registro de usuario            | ❌    | Público |
| POST   | /login      | Login + token JWT              | ❌    | Público |
| GET    | /           | Obtener todos los usuarios     | ✅    | Admin   |

### Tareas (`/api/tasks`)
| Método | Ruta        | Descripción                      | Token | Rol           |
|--------|-------------|----------------------------------|--------|---------------|
| POST   | /           | Crear tarea                      | ✅     | Usuario       |
| GET    | /           | Obtener tareas del usuario       | ✅     | Usuario       |
| PATCH  | /:id        | Marcar como completa/incompleta | ✅     | Usuario       |
| DELETE | /:id        | Eliminar tarea                   | ✅     | Usuario       |

### Categorías (`/api/categories`)
| Método | Ruta        | Descripción             | Token | Rol     |
|--------|-------------|-------------------------|--------|---------|
| POST   | /           | Crear nueva categoría   | ✅     | Usuario |
| GET    | /           | Obtener todas           | ✅     | Usuario |
| PATCH  | /:id        | Actualizar categoría    | ✅     | Admin   |
| DELETE | /:id        | Eliminar categoría      | ✅     | Admin   |

---

## 📘 Documentación Swagger

Disponible en:  
**http://localhost:3000/public-api**

---

## 👨‍💻 Autor

Desarrollado por **Elian Armoa**  
Proyecto Final – Backend Developer – Módulo II
