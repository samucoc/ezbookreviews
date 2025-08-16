# EzBookReviews

   EzBookReviews es una aplicación web para buscar, registrar y administrar libros, con funcionalidades de login, biblioteca personal y calificaciones.  

## Características

- **Login y registro de usuarios** con JWT.
- **Middleware de autenticación** para proteger rutas.
- **Buscador de libros** con integración a MongoDB.
- **Biblioteca personal**:
  - Guardar libros con review, calificación y portada en base64.
  - Editar review y calificación.
  - Eliminar libros.
  - Filtrar libros por título, autor o review.
- **Últimas búsquedas** guardadas por usuario.
- **Frontend con Nuxt 3 y Pinia** para estado global.
- **Backend con Node.js, Express y MongoDB**.
- Compatible con **SSR y CSR**.

## Instalación

### Backend

   1. Clonar el repositorio y entrar a la carpeta backend:
         git clone https://github.com/samucoc/ezbookreviews.git
         git checkout dev
         cd backend
   2. Instalar dependencias:
         npm install
   3. Configurar variables de entorno (.env):
         PORT=4000
         MONGODB_URI=XXXXXXXXXXXX
         OPENLIBRARY_BASE=https://openlibrary.org
         COVERS_BASE=https://covers.openlibrary.org
         JWT_SECRET=YYYYYYYYYYYYYY
   4. Iniciar servidor:
         npm run dev

   El backend estará corriendo en http://localhost:4000.

### Frontend

   1. Entrar a la carpeta frontend:
         cd frontend
   2. Instalar dependencias:
         npm install
   3. Configurar variable entorno
         NUXT_PUBLIC_API_BASE=http://localhost:4000/api     // ejemplo
   4. Iniciar Nuxt 3:
         npm run dev
   El frontend estará corriendo en http://localhost:3000.

## Dependencias
### Backend
   express – Framework para crear APIs REST.
   mongoose – ORM para MongoDB.
   dotenv – Variables de entorno.
   bcryptjs – Para hashear contraseñas.
   jsonwebtoken – Para autenticación con JWT.
   morgan – Logging de peticiones HTTP.
   cors – Configuración de CORS.

### Frontend
   nuxt – Framework Vue 3 con SSR.
   pinia – Manejo de estado global.
   axios – Para llamadas HTTP.
   @pinia/nuxt – Integración Pinia en Nuxt.
   sass / scss – Estilos.

## Estructura del proyecto
   ezbookreviews/
   ├─ backend/
   │  ├─ controllers/
   │  ├─ models/
   │  ├─ routes/
   │  ├─ middleware/
   │  └─ index.ts
   ├─ frontend/
   │  ├─ pages/
   │  ├─ layouts/
   │  ├─ components/
   │  ├─ stores/
   │  └─ middleware/
   └─ README.md

## Uso
   Registrar un usuario o iniciar sesión.
   Buscar libros en la base de datos.
   Agregar libros a tu biblioteca personal.
   Editar review y calificación.
   Filtrar y consultar libros guardados.
   Cerrar sesión cuando quieras.

## Licencia
   Este proyecto es libre para uso educativo y personal.
