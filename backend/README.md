# StockFácil — Backend

API REST de inventario para minimarkets. Node.js + Express + SQLite integrado (`node:sqlite`, sin compilación nativa).

## Requisitos

- Node.js 22.5 o superior (probado con v24). SQLite viene dentro de Node, no hay que instalar nada aparte.

## Instalación y arranque

```
cd backend
npm install
npm start
```

Debería mostrar:

```
Seed cargado: 12 productos de prueba.
StockFácil backend corriendo en http://localhost:3001
```

El archivo `stockfacil.db` se crea solo la primera vez, con las tablas y 12 productos de prueba. Está en `.gitignore`: cada instalación genera la suya.

Si Node te dice `unknown option '--experimental-sqlite'`, tu versión ya no necesita el flag. Cambia los scripts de `package.json` a `"start": "node server.js"`.

## Variables de entorno

| Variable | Por defecto | Para qué |
|---|---|---|
| `PORT` | `3001` | Puerto del servidor |
| `DB_PATH` | `backend/stockfacil.db` | Ruta del archivo SQLite |
| `CORS_ORIGIN` | cualquier origen | Origen permitido (ej. la URL del frontend desplegado) |

## Base de datos

- `productos`: catálogo.
- `stock_actual`: stock vigente por producto.
- `movimientos`: historial de entradas y salidas.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Productos con su stock |
| POST | `/api/productos` | Crea un producto |
| GET | `/api/stock` | Stock crudo |
| GET | `/api/movimientos` | Historial de movimientos |
| POST | `/api/movimientos` | Registra una entrada o salida |
| GET | `/api/reporte` | Resumen (hoy/semana), top productos y últimos movimientos |

Ejemplo (CMD, en una sola línea):

```
curl -X POST http://localhost:3001/api/movimientos -H "Content-Type: application/json" -d "{\"producto_id\": 1, \"tipo\": \"salida\", \"cantidad\": 5}"
```

## Validaciones

- La cantidad debe ser mayor a 0.
- Se rechazan las salidas mayores al stock disponible.
- Los errores se devuelven en JSON.
