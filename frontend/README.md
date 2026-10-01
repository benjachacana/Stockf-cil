# StockFácil — Frontend

Interfaz móvil (mobile-first) en React 18 + Vite 5. Consume la API del backend.

## Instalación y arranque

El backend debe estar corriendo antes (ver `../backend/README.md`).

```
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173/.

Son dos procesos separados, cada uno en su terminal:

- Terminal 1: `backend` → `npm start` (puerto 3001)
- Terminal 2: `frontend` → `npm run dev` (puerto 5173)

## Configuración

`VITE_API_URL` define la URL del backend. Si no se define, usa el backend local.
Para desplegar, copia `.env.example` a `.env.production` y pon la URL real.

## Pantallas

- **Inventario:** métricas (total, en stock, bajo, agotado), búsqueda por texto combinada con filtro de categoría, alertas y exportación a CSV.
- **Registrar:** entradas y salidas de stock. Pide confirmación en salidas de 50 unidades o más.
- **Agregar:** crea un producto; las categorías existentes aparecen como chips.
- **Detalle de producto:** historial de movimientos del producto.
- **Reporte:** resumen de hoy y la semana, top 5 de productos y últimos 10 movimientos.

## Estructura

```
src/
  main.jsx, App.jsx      navegación por pestañas (useState)
  api.js                 cliente de la API
  exportCsv.js           exportar inventario a CSV
  components/BottomNav.jsx
  screens/               una pantalla por archivo
```

## Pendiente

- Autenticación.
- Editar y eliminar productos.
- Pulido de diseño según el prototipo.
