## 📝 Notas Importantes para la Corrección

Para facilitar la evaluación de las funcionalidades de administración, hemos incluido un script que crea automáticamente un usuario administrador.

1.  **Asegurar que el servidor MongoDB esté corriendo** 
2.  **Ejecuta el script de creación de administrador:**
    Navega a la carpeta `backend` en tu terminal y ejecuta:
    ```bash
    npm run create-admin
    ```
    Este comando creará o actualizará un usuario con los siguientes credenciales:
    * **Username:** `Administrador`
    * **Password:** `123456`

3.  **Probar las funcionalidades de administrador:**
    * Una vez que el script haya terminado, inicia tu servidor backend (`npm run dev`).
    * Utiliza Postman (o tu frontend) para enviar una petición `POST` a `http://localhost:3000/api/users/login` con el `Username` y `Password` proporcionados arriba.
    * Utiliza el token JWT obtenido para acceder a las rutas protegidas para administradores, como `GET /api/users` o `PATCH/DELETE /api/categories/:id`.

# 🧠 Task Manager API - Backend

Este es el backend de una aplicación Full Stack diseñada para la gestión eficiente de tareas. Desarrollado como el **Proyecto Final** del curso **Backend Developer - Módulo II** en la Facultad de Ingeniería de la UNMDP, este servicio RESTful utiliza un stack de tecnologías modernas como Node.js, Express y MongoDB. Está completamente preparado para integrarse con un frontend desarrollado en React y cumple con todos los requisitos académicos.

---

## 🚀 Tecnologías utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework web para Node.js, utilizado para construir la API.
* **MongoDB**: Base de datos NoSQL, para almacenar la información de tareas, usuarios y categorías.
* **Mongoose**: ODM (Object Data Modeling) para MongoDB en Node.js, facilitando la interacción con la base de datos.
* **`dotenv`**: Para gestionar variables de entorno de forma segura.
* **`cors`**: Middleware para habilitar Cross-Origin Resource Sharing.
* **`jsonwebtoken`**: Para la generación y verificación de JSON Web Tokens (JWT) para la autenticación.
* **`bcryptjs`**: Para el hashing seguro de contraseñas.
* **`swagger-ui-express`**: Middleware para servir la documentación interactiva de la API (Swagger UI).
* **`nodemon`**: Herramienta de desarrollo para el reinicio automático del servidor durante el desarrollo.

---

## 📦 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone [https://github.com/elianarmoa/GestorTareas.git](https://github.com/elianarmoa/GestorTareas.git)
cd GestorTareas/backend
2. Variables de entorno
Crea un archivo .env en la raíz de la carpeta backend y añade las siguientes variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=miclavesecreta123
PORT: Puerto en el que se ejecutará el servidor backend.

MONGO_URI: URI de conexión a tu base de datos MongoDB.

JWT_SECRET: Clave secreta para firmar y verificar los JSON Web Tokens.

3. Instalar dependencias
Bash

npm install
4. Ejecutar el servidor
Para iniciar el servidor en modo desarrollo (con nodemon para reinicio automático):

Bash

npm run dev
El servidor se ejecutará en http://localhost:3000.
La documentación interactiva de la API (Swagger UI) estará disponible en http://localhost:3000/public-api.

📁 Estructura del proyecto
backend/
│
├── controllers/
│   ├── categoryController.js   # Lógica CRUD para categorías
│   ├── taskController.js       # Lógica CRUD para tareas
│   └── userController.js       # Lógica para usuarios (registro, login, administración)
│
├── middlewares/
│   ├── authMiddleware.js       # Verificación de JWT para rutas protegidas
│   └── roleMiddleware.js       # Verificación de roles para acceso a rutas específicas
│
├── models/
│   ├── Category.js             # Esquema de datos para categorías
│   ├── Task.js                 # Esquema de datos para tareas (con referencia a usuarios y categorías)
│   └── User.js                 # Esquema de datos para usuarios (con encriptación de contraseña y roles)
│
├── routes/
│   ├── categoryRoutes.js       # Rutas API para la gestión de categorías
│   ├── taskRoutes.js           # Rutas API para la gestión de tareas
│   └── userRoutes.js           # Rutas API para autenticación y gestión de usuarios
│
├── .env                        # Variables de entorno
├── index.js                    # Archivo principal de la aplicación (entry point)
├── package.json                # Dependencias y scripts del proyecto
└── swagger.json                # Definición de la API para Swagger UI (si lo tienes)
🧠 Funcionalidades de la API
Autenticación de Usuarios:

Registro de nuevos usuarios.

Inicio de sesión con generación de JWT.

Contraseñas encriptadas con bcryptjs.

Gestión de Usuarios (Solo Administradores):

Listado de todos los usuarios registrados (ruta protegida por rol admin).

Gestión de Tareas:

Creación de tareas (asociadas al usuario autenticado y a una categoría).

Listado de tareas por usuario.

Actualización del estado de una tarea (completada/incompleta).

Eliminación de tareas.

Relación con Categorías utilizando populate de Mongoose.

Gestión de Categorías:

Creación de nuevas categorías.

Listado de todas las categorías.

Actualización de categorías por ID (protegida por rol admin).

Eliminación de categorías por ID (protegida por rol admin).

Middleware de Protección:

Rutas protegidas por token JWT válido.

Rutas protegidas por roles específicos (ej. admin).

📋 Endpoints de la API
El servidor se ejecuta en http://localhost:3000.

Usuarios (Base: /api/users)
Método

Ruta

Descripción

Requiere Token

Permisos

POST

/register

Registra un nuevo usuario

No

Público

POST

/login

Inicia sesión y devuelve un token JWT

No

Público

GET

/

Obtiene todos los usuarios

Sí

admin


Exportar a Hojas de cálculo
Ejemplo de POST /api/users/register (Body - JSON):

JSON

{
  "username": "nuevo_usuario",
  "password": "passwordSeguro123"
}
Ejemplo de POST /api/users/login (Body - JSON):

JSON

{
  "username": "usuario_existente",
  "password": "passwordSeguro123"
}
Respuesta exitosa:

JSON

{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1Ni..."
}
Tareas (Base: /api/tasks)
Método

Ruta

Descripción

Requiere Token

Permisos

POST

/

Crea una nueva tarea para el usuario autenticado

Sí

Autenticado

GET

/

Obtiene todas las tareas del usuario autenticado

Sí

Autenticado

PATCH

/:id

Alterna el estado completed de una tarea

Sí

Autenticado

DELETE

/:id

Elimina una tarea por su ID

Sí

Autenticado


Exportar a Hojas de cálculo
Ejemplo de POST /api/tasks (Body - JSON):
(Asume que ya creaste una categoría y tienes su _id)

JSON

{
  "title": "Completar informe del proyecto",
  "description": "Redactar el informe final para la reunión del viernes.",
  "category": "60d0fe4f5a3e1c0015f8e1a2" // Reemplazar con un ID de categoría válido obtenido de /api/categories
}
Categorías (Base: /api/categories)
Método

Ruta

Descripción

Requiere Token

Permisos

POST

/

Crea una nueva categoría

Sí

Autenticado

GET

/

Obtiene todas las categorías

Sí

Autenticado

PATCH

/:id

Actualiza una categoría por su ID

Sí

admin

DELETE

/:id

Elimina una categoría por su ID

Sí

admin


Exportar a Hojas de cálculo
Ejemplo de POST /api/categories (Body - JSON):

JSON

{
  "name": "Trabajo"
}
Documentación de la API
Puedes explorar y probar los endpoints de la API de forma interactiva en Swagger UI, accediendo a:

http://localhost:3000/public-api

👨‍💻 Autor
Desarrollado por Elian Armoa
Proyecto final del curso Backend Developer - Módulo II