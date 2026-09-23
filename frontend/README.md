# StockFácil — Frontend (Fase 1 MVP)

## 0. Primero: agrega el endpoint nuevo al backend

Antes de tocar el frontend, abre tu `server.js` del backend y pega el contenido de
`endpoint-nuevo-agregar-a-server.js` justo **antes** de la línea:

```js
app.listen(PORT, () => {
```

Esto agrega `POST /api/productos`, que necesita la pantalla "Agregar". Guarda el archivo — si el backend
seguía corriendo, deténlo (Ctrl+C en su terminal) y vuelve a correr `npm start`.

## 1. Instalación del frontend

1. Crea una carpeta `frontend` **al mismo nivel** que `backend` (dentro de `stockfacil`), y copia ahí toda
   esta estructura, respetando las carpetas:

```
frontend/
  index.html
  vite.config.js
  package.json
  src/
    main.jsx
    App.jsx
    api.js
    index.css
    components/
      BottomNav.jsx
    screens/
      InventarioScreen.jsx
      RegistrarScreen.jsx
      AgregarScreen.jsx
```

2. En una terminal, dentro de `frontend`:

```
npm install
npm run dev
```

Vite te va a mostrar algo como:

```
Local: http://localhost:5173/
```

Abre esa URL en tu navegador.

## 2. Corre AMBOS al mismo tiempo

El frontend necesita que el backend esté corriendo en paralelo (son dos procesos separados):

- **Terminal 1:** dentro de `backend` → `npm start` (puerto 3001)
- **Terminal 2:** dentro de `frontend` → `npm run dev` (puerto 5173)

Puedes abrir dos terminales en VSCode con el botón "+" del panel de Terminal.

## 3. Qué deberías ver

- **Inventario:** tus 12 productos con las métricas (Total/Stock/Bajo/Agotado), filtros por categoría, y
  las alertas — todo calculado en vivo desde la base de datos real.
- **Registrar:** selector de producto, toggle Entrada/Salida, y al guardar, el stock se actualiza de
  verdad (prueba y después revisa Inventario — debería reflejar el cambio).
- **Agregar:** crea un producto nuevo y debería aparecer en Inventario.

## Qué falta (a propósito, según el roadmap)

- Sin autenticación todavía
- Sin edición ni eliminación de productos
- Sin historial visual de movimientos (el endpoint existe, falta la pantalla)
- Estilo con CSS plano, no Tailwind (se puede migrar en la Fase 2 si quieres)

Avísame cómo te fue.
