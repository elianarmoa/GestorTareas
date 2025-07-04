# 🧠 Task Manager API - Backend

Este es el backend de una aplicación Full Stack para gestionar tareas. Fue desarrollado como parte del Proyecto Final del curso **Backend Developer - Módulo II**, utilizando tecnologías modernas como **Node.js**, **Express**, y **MongoDB**. Está preparado para integrarse con un frontend hecho en React y cumple con los requisitos académicos solicitados.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- cors
- nodemon

---

## 📦 Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/usuario/proyecto-final.git
cd proyecto-final/backend
```

O simplemente navegá a la carpeta del backend:

```bash
cd "C:\Users\Elian\Desktop\Facultad Programacion\Curso Full-Stack\ProyectoFinal\backend"
```

---

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:

- `express`: servidor HTTP
- `mongoose`: conexión a MongoDB
- `cors`: habilita CORS
- `dotenv`: manejo de variables de entorno
- `nodemon` (dev): reinicio automático del servidor en desarrollo

---

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del backend con el siguiente contenido:

```
MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=3000
```

> Podés modificar el puerto si es necesario o usar una URI de MongoDB Atlas para producción.

---

### 4. Ejecutar el servidor

```bash
npm run dev
```

Este comando usa `nodemon` para levantar el servidor y reiniciarlo automáticamente cuando se detectan cambios.

---

## 📋 Endpoints disponibles

| Método | Endpoint           | Descripción                        |
|--------|--------------------|------------------------------------|
| GET    | /api/tasks         | Lista todas las tareas             |
| POST   | /api/tasks         | Crea una nueva tarea               |
| PATCH  | /api/tasks/:id     | Alterna estado completado/incompleto |
| DELETE | /api/tasks/:id     | Elimina una tarea                  |

---

## 📁 Estructura del proyecto

```
backend/
│
├── controllers/        # Lógica de las tareas (CRUD)
│   └── taskController.js
│
├── models/             # Esquemas de Mongoose
│   └── Task.js
│
├── routes/             # Rutas de la API
│   └── taskRoutes.js
│
├── middlewares/        # Middlewares personalizados
│   └── errorHandler.js
│
├── .env                # Variables de entorno
├── index.js            # Entrada principal del servidor
├── package.json        # Configuración del proyecto
├── README.md           # Esta documentación
```

---

## 🛠 Funcionalidades actuales

- CRUD completo de tareas
- Validación de datos (título obligatorio)
- Middleware global para manejo de errores
- Conexión a base de datos MongoDB
- API REST estructurada y escalable
- Listo para integrarse con un frontend en React

---

## 🎯 En desarrollo

- Documentación Swagger en `/public-api` (solo endpoints GET)
- Sistema de autenticación (registro, login, JWT)
- Protección de rutas privadas para usuarios registrados

---

## 👨‍💻 Autor

Desarrollado por **Elian Armoa**  
Proyecto final del curso **Backend Developer - Módulo II**  
Profesor: **Santiago Rada**

---

> 💡 Este proyecto está pensado para seguir creciendo. ¡Se aceptan sugerencias, mejoras o integraciones futuras!
