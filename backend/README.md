# StockFácil — Backend (Fase 1 MVP)

## Antes de instalar: limpia el intento anterior

Como `better-sqlite3` alcanzó a fallar a mitad de instalación, borra esto primero dentro de tu carpeta `backend`:

```
rmdir /s /q node_modules
del package-lock.json
```

(Si `node_modules` no llegó a crearse del todo, no pasa nada si el primer comando da error — sigue igual.)

## Instalación

1. Reemplaza `package.json` y `server.js` con estas versiones nuevas (misma carpeta `backend`).
2. En la terminal, dentro de esa carpeta:

```
npm install
```

Esta vez solo instala `express` y `cors` — nada que compilar, así que no debería dar el error de Visual Studio.

3. Levanta el servidor:

```
npm start
```

Deberías ver:

```
Seed cargado: 12 productos de prueba.
StockFácil backend corriendo en http://localhost:3001
```

Se usa `node:sqlite`, el módulo de SQLite que viene integrado en Node.js (desde la v22), por eso no necesitas instalar ni compilar nada aparte. El archivo `stockfacil.db` se crea solo la primera vez, con las 3 tablas y los 12 productos de prueba.

**Nota:** si al correr `npm start` te sale un error tipo "unknown option '--experimental-sqlite'", es porque tu versión de Node ya no necesita ese flag (viene estable por defecto). En ese caso, abre `package.json` y deja los scripts así:

```
"start": "node server.js",
"dev": "node server.js"
```

## Probar los endpoints

Con el servidor corriendo, abre en tu navegador:

- **Lista de productos con stock:** http://localhost:3001/api/productos
- **Stock crudo:** http://localhost:3001/api/stock
- **Historial de movimientos:** http://localhost:3001/api/movimientos

**Registrar un movimiento** (con curl, en CMD — todo en una sola línea):

```
curl -X POST http://localhost:3001/api/movimientos -H "Content-Type: application/json" -d "{\"producto_id\": 1, \"tipo\": \"salida\", \"cantidad\": 5}"
```

## Qué sigue

Una vez que confirmes que estos 4 endpoints funcionan, seguimos con el frontend en React + Vite que los consume — según la Fase 1 del roadmap.
