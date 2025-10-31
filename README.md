# HRM Frontend — Sistema de Gestión de Recursos Humanos y Nóminas

Aplicación web desarrollada con **React 18**, **TypeScript** y **Vite**, que actúa como interfaz de usuario del **Sistema HRM**.  
Su objetivo es ofrecer una plataforma moderna, segura y eficiente para la **gestión de empleados, nóminas, usuarios, documentos y reportes**, en integración directa con el backend construido en **Node.js + Express + Prisma**.

---

##  Características Principales

- **Arquitectura modular y escalable**, basada en componentes y hooks reutilizables.  
- **Validaciones robustas** con [Zod](https://zod.dev/).  
- **Gestión del estado asíncrono** mediante [React Query](https://tanstack.com/query).  
- **Formularios inteligentes** con [React Hook Form](https://react-hook-form.com/).  
- **Diseño responsivo** y moderno usando **Bootstrap 5** y **Bootstrap Icons**.  
- **Manejo de autenticación** con JWT (tokens almacenados en `localStorage`).  
- **Integración directa con la API REST del backend HRM**.  
- **Optimización y build rápido** gracias a Vite.  
- **Soporte para exportar documentos PDF y capturas** mediante `jspdf` y `html2canvas`.

---

##  Tecnologías Utilizadas

| Tipo | Herramienta |
|------|--------------|
| Framework base | [React 18](https://react.dev/) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) |
| Bundler | [Vite 4](https://vitejs.dev/) |
| Formularios | [React Hook Form](https://react-hook-form.com/) |
| Validación | [Zod](https://zod.dev/) |
| Estado remoto | [React Query](https://tanstack.com/query) |
| Peticiones HTTP | [Axios](https://axios-http.com/) |
| UI / Estilos | [Bootstrap 5](https://getbootstrap.com/) y [Bootstrap Icons](https://icons.getbootstrap.com/) |
| Generación PDF / Capturas | `jspdf`, `html2canvas` |
| Control de dependencias | npm |

---

##  Autenticación y Seguridad

- **Autenticación JWT**: Login, refresh y verificación (`/auth/login`, `/auth/refresh`, `/auth/me`).  
- **Protección de rutas privadas** mediante contexto global de autenticación (`useAuth`).  
- **Roles definidos**: `ADMIN`, `RRHH`, `EMPLEADO`.  
- **Interceptores Axios** que:
  - Añaden el token a cada petición.  
  - Redirigen al login en caso de `401 Unauthorized`.  
- **Seguridad complementaria** mediante:
  - Cabeceras HTTP seguras (via backend con Helmet).  
  - CORS controlado.  
  - Tokens almacenados de forma segura en `localStorage`.

---

##  Estructura del Proyecto

hrm-frontend/
├── public/                     # Recursos estáticos
├── src/
│   ├── core/                   # Núcleo del sistema (API, contextos, hooks)
│   │   └── api/client.ts       # Cliente Axios centralizado
│   ├── components/             # Componentes reutilizables de UI
│   ├── layout/                 # Layouts y navegación principal
│   ├── modules/                # Módulos funcionales (auth, employees, payroll, etc.)
│   ├── styles/                 # Archivos de estilos globales
│   ├── App.tsx                 # Componente raíz
│   ├── AppRoutes.tsx           # Definición de rutas (React Router 6)
│   └── main.tsx                # Punto de entrada
├── .env                        # Variables de entorno
├── package.json
├── tsconfig.json
└── vite.config.ts 


---

##  Integración con el Backend

Este frontend se comunica directamente con el backend del proyecto **HRM**:
http://localhost:4000/api

---

### Cliente HTTP centralizado
La comunicación se realiza mediante el cliente `apiClient` (`src/core/api/client.ts`):

- Configura automáticamente la **baseURL** desde `.env` (`VITE_API_URL`).  
- Incluye interceptores para añadir el **Bearer Token** en los headers.  
- Captura errores de sesión (`401`) y redirige al login.  
- Soporta peticiones `GET`, `POST`, `PUT`, `DELETE`.

### Ejemplo

const response = await apiClient.get('/employees');
console.log(response.data);

---
##  Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto con:

VITE_API_URL=http://localhost:4000/api

Asegúrate de que el backend esté ejecutándose en el puerto 4000 antes de iniciar el frontend.

---
##  Instalación y Ejecución

1. Clonar el repositorio

   git clone https://github.com/tu-usuario/hrm-frontend.git
    cd hrm-frontend

2. Instalar dependencias

   npm install

3. Configurar variables de entorno

   cp .env.example .env
  # o crea manualmente el archivo .env con la URL de la API

4. Iniciar el entorno de desarrollo

   npm run dev

   Accede a:
     http://localhost:5173

5. Compilar para producción

   npm run build

6. Previsualizar build

   npm run preview

---

##  Scripts Disponibles

| Script | Descripción |
|--------|--------------|
| `npm run dev` | Inicia el servidor de desarrollo con Vite |
| `npm run build` | Compila el proyecto en `/dist` |
| `npm run preview` | Sirve el build localmente para pruebas |
| `npm run lint` | Ejecuta ESLint y verifica el código |
| `npm run type-check` | Valida los tipos de TypeScript |

---

##  Módulos Principales

| Módulo | Descripción | Rutas Principales |
|--------|--------------|------------------|
| **Auth** | Login, refresh y gestión de sesión | `/login`, `/auth/me` |
| **Empleados** | Listado y gestión de empleados | `/employees`, `/employees/:id` |
| **Usuarios** | Administración de usuarios del sistema | `/users`, `/users/:id` |
| **Documentos** | Subida y descarga de documentos | `/documents`, `/employees/:id/documents` |
| **Nóminas** | Creación, generación y cierre de nóminas | `/payroll`, `/payroll/:id` |
| **Reportes** | Generación de reportes PDF/CSV | `/reports/generate` |

---

##  Buenas Prácticas

- Uso extensivo de **TypeScript** para seguridad de tipos.  
- Modularización limpia en `core`, `modules` y `components`.  
- Hooks reutilizables (`useAuth`, `usePayroll`, `useEmployees`, etc.).  
- Validaciones declarativas con **Zod**.  
- Control de errores global y redirección automática al expirar sesión.  
- Arquitectura basada en **principios REST y Clean Code**.  
- Integración con **React Query** para manejo optimizado de datos.  
- Código estandarizado con **ESLint** y **Prettier**.

---

##  Autor

**Javier Rivera**  
Proyecto académico–profesional para la implementación de un  
**Sistema de Gestión de Recursos Humanos y Nóminas (HRM)**  
Desarrollado con dedicación y aplicando las mejores prácticas modernas de desarrollo web.

---

##  Licencia

Este proyecto se distribuye bajo licencia **ISC**.  
Puedes utilizarlo, adaptarlo y modificarlo libremente, manteniendo la atribución correspondiente.

---

 **Tip:**  
Puedes visualizar la documentación completa de la API importando el archivo `openapi.yaml` del backend en **Swagger Editor** o **Redocly**, y así navegar fácilmente por todos los endpoints disponibles.

