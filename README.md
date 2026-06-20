# admin-app

Panel de administración de un sistema de pedidos de comida. Permite gestionar productos, ingredientes, categorías y pedidos con control de acceso por roles.

## Instalación
## 1. Clonas el repo.

git clone https://github.com/Tiagof03/Repositorio-Administrador.git

## 2. Entras a la carpeta.

cd Repositorio-Administrador

## 3. Instalas las dependencias.

pnpm install

## 4. Copias las variables de entorno.

cp .env.example .env

## 5. Editar `.env` con la URL de la API:

VITE_API_URL=http://localhost:8000/api/v1

## 6. Levantar el proyecto

pnpm run dev

## 7. Login con Admin

admin@foodstore.com
Admin1234!

## Estructura de carpetas

```
src/
├── features/         # módulos por dominio
│   ├── products/     # productos del menú
│   ├── ingredients/  # ingredientes
│   ├── categories/   # categorías de productos
│   ├── orders/       # pedidos
│   └── auth/         # autenticación
├── shared/           # componentes reutilizables (Layout, Sidebar, Navbar)
├── store/            # stores de Zustand
├── lib/              # instancia de axios
└── router/           # configuración de rutas
```

Cada feature sigue la misma estructura interna:

```
feature/
├── types.ts          # interfaces y tipos
├── services/         # llamadas a la API
├── hooks/            # hooks de TanStack Query
├── components/       # componentes del módulo
└── page/             # páginas / vistas
```

## Variables de entorno

| Variable        | Descripción              | Ejemplo                       |
| --------------- | ------------------------ | ----------------------------- |
| `VITE_API_URL`  | URL base de la API REST  | `http://localhost:8000/api/v1`   |

## Roles del sistema

| Rol        | Permisos                                      |
| ---------- | --------------------------------------------- |
| `admin`    | CRUD completo sobre todos los recursos        |
| `empleado` | Solo lectura                                  |
| `cajero`   | Gestión de estados de pedidos                 |

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **React Router DOM v7** — enrutamiento del cliente
- **TanStack Query v5** — fetching y caché de datos
- **TanStack Table v8** — tablas con paginación y filtros
- **TanStack Form v1** — formularios tipados
- **Axios v1** — cliente HTTP
- **Zustand v5** — estado global
- **Tailwind CSS v4** — estilos utilitarios



