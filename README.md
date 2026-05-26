# admin-app

Panel de administración de un sistema de pedidos de comida. Permite gestionar productos, ingredientes, categorías y pedidos con control de acceso por roles.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **React Router DOM v7** — enrutamiento del cliente
- **TanStack Query v5** — fetching y caché de datos
- **TanStack Table v8** — tablas con paginación y filtros
- **TanStack Form v1** — formularios tipados
- **Axios v1** — cliente HTTP
- **Zustand v5** — estado global
- **Tailwind CSS v4** — estilos utilitarios

## Instalación

```bash
npm install
```

Copiar las variables de entorno:

```bash
cp .env.example .env
```

Editar `.env` con la URL de la API:

```
VITE_API_URL=http://localhost:3000/api
```

## Levantar el proyecto

```bash
# desarrollo
npm run dev

# build de producción
npm run build

# preview del build
npm run preview
```

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
| `VITE_API_URL`  | URL base de la API REST  | `http://localhost:3000/api`   |

## Roles del sistema

| Rol        | Permisos                                      |
| ---------- | --------------------------------------------- |
| `admin`    | CRUD completo sobre todos los recursos        |
| `empleado` | Solo lectura                                  |
| `cajero`   | Gestión de estados de pedidos                 |

## PRUEBAS DE LOGIN 

localStorage.setItem('auth-storage', JSON.stringify({
    state: {
      user: { id: 1, nombre: "Admin", email: "admin@test.com" },
      token: "test-token",
      rol: "admin"
    },
    version: 0
  }))


