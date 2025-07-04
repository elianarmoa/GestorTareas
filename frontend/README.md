
# 🧠 Task Manager Frontend - React

Este es el frontend de la aplicación Full Stack de gestión de tareas. Desarrollado con **React**, utiliza **Context API** para manejar la autenticación, **Axios** para comunicarse con el backend, y **React Router** para la navegación.

---

## 🚀 Tecnologías utilizadas

- React
- Vite
- Axios
- React Router DOM
- Context API

---

## 📦 Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/usuario/proyecto-final.git
cd proyecto-final/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
npm run dev
```

Por defecto se ejecuta en `http://localhost:5173`

---

## 📁 Estructura del proyecto

frontend/
│
├── components/         # Componentes reutilizables
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── TaskForm.jsx
│   └── TaskList.jsx
│
├── context/            # Contexto de autenticación
│   ├── AuthContext.js
│   └── AuthContext.jsx
│
├── pages/              # Vistas principales
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── App.jsx             # Definición de rutas
├── main.jsx            # Entrada principal
├── index.css           # Estilos base
└── README.md

---

## 🧠 Funcionalidades

- Registro de usuario (`POST /api/users/register`)
- Login con JWT (`POST /api/users/login`)
- Context global para mantener sesión activa
- Visualización de tareas del usuario logueado (`GET /api/tasks`)
- Crear tareas (`POST /api/tasks`)
- Eliminar tareas (`DELETE /api/tasks/:id`)
- Marcar tareas como completadas/incompletas (`PATCH /api/tasks/:id`)

---

## 📋 Rutas de la app

| Ruta         | Componente    | Acceso        |
|--------------|---------------|---------------|
| `/`          | Home          | Protegido     |
| `/login`     | Login         | Público       |
| `/register`  | Register      | Público       |

---

## 👨‍💻 Autor

Desarrollado por **Elian Armoa**  
Proyecto final del curso **Backend Developer - Módulo II**

---

> 💡 Este proyecto está preparado para ampliarse fácilmente: filtros, edición de tareas, panel de administración, etc.
