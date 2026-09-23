// server.js — Backend MVP de StockFácil
// Node.js + Express + SQLite integrado (node:sqlite, sin compilación nativa)

const express = require('express');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Base de datos
// ---------------------------------------------------------------------------
const db = new DatabaseSync(path.join(__dirname, 'stockfacil.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    precio_compra REAL DEFAULT 0,
    precio_venta REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS stock_actual (
    producto_id INTEGER PRIMARY KEY,
    cantidad_actual INTEGER NOT NULL DEFAULT 0,
    ultima_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
  );

  CREATE TABLE IF NOT EXISTS movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    usuario TEXT DEFAULT 'admin',
    FOREIGN KEY (producto_id) REFERENCES productos(id)
  );
`);

// ---------------------------------------------------------------------------
// Datos seed (solo si la tabla productos está vacía)
// ---------------------------------------------------------------------------
const totalProductos = db.prepare('SELECT COUNT(*) AS n FROM productos').get().n;

if (totalProductos === 0) {
  const insertProducto = db.prepare(`
    INSERT INTO productos (nombre, categoria, precio_compra, precio_venta)
    VALUES (?, ?, ?, ?)
  `);
  const insertStock = db.prepare(`
    INSERT INTO stock_actual (producto_id, cantidad_actual)
    VALUES (?, ?)
  `);

  const seed = [
    ['Coca-Cola Original 1.5L', 'Bebidas', 1200, 1800, 45],
    ['Papas Fritas Lay\'s Al Plato 150g', 'Snacks', 900, 1500, 12],
    ['Leche Entera Soprole 1L', 'Lácteos', 800, 1200, 3],
    ['Detergente Líquido Omo 3L', 'Limpieza', 3200, 4500, 8],
    ['Pan de Molde Blanco Ideal', 'Panadería', 1400, 2100, 0],
    ['Atún San José en Aceite', 'Enlatados', 900, 1350, 24],
    ['Fanta Naranja 1.5L', 'Bebidas', 1200, 1800, 30],
    ['Galletas Triton Chocolate', 'Snacks', 600, 990, 18],
    ['Yogurt Nestlé Frutilla 1L', 'Lácteos', 1100, 1650, 2],
    ['Cloro Clorinda 1L', 'Limpieza', 700, 1100, 15],
    ['Marraqueta (bolsa 6 uds)', 'Panadería', 500, 900, 0],
    ['Duraznos en Conserva Del Monte', 'Enlatados', 1000, 1550, 9],
  ];

  db.exec('BEGIN');
  try {
    for (const [nombre, categoria, precio_compra, precio_venta, stock] of seed) {
      insertProducto.run(nombre, categoria, precio_compra, precio_venta);
      const id = db.prepare('SELECT last_insert_rowid() AS id').get().id;
      insertStock.run(id, stock);
    }
    db.exec('COMMIT');
    console.log(`Seed cargado: ${seed.length} productos de prueba.`);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function calcularEstado(cantidad) {
  if (cantidad === 0) return 'agotado';
  if (cantidad < 10) return 'bajo';
  return 'en_stock';
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

// GET /api/productos — lista completa con stock y estado (para InventarioScreen)
app.get('/api/productos', (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.nombre, p.categoria, p.precio_compra, p.precio_venta,
           COALESCE(s.cantidad_actual, 0) AS stock
    FROM productos p
    LEFT JOIN stock_actual s ON s.producto_id = p.id
    ORDER BY p.nombre ASC
  `).all();

  const productos = rows.map((p) => ({
    ...p,
    estado: calcularEstado(p.stock),
  }));

  res.json(productos);
});

// GET /api/stock — stock crudo de todos los productos (para el selector de RegistrarScreen)
app.get('/api/stock', (req, res) => {
  const rows = db.prepare(`
    SELECT producto_id, cantidad_actual, ultima_actualizacion
    FROM stock_actual
  `).all();
  res.json(rows);
});

// GET /api/movimientos — historial (opcional ?producto_id=X)
app.get('/api/movimientos', (req, res) => {
  const { producto_id } = req.query;

  let rows;
  if (producto_id) {
    rows = db.prepare(`
      SELECT * FROM movimientos WHERE producto_id = ? ORDER BY fecha DESC
    `).all(producto_id);
  } else {
    rows = db.prepare(`SELECT * FROM movimientos ORDER BY fecha DESC`).all();
  }

  res.json(rows);
});

// POST /api/movimientos — registrar entrada o salida
app.post('/api/movimientos', (req, res) => {
  const { producto_id, tipo, cantidad, usuario } = req.body;

  if (!producto_id || !tipo || !cantidad) {
    return res.status(400).json({ error: 'Faltan campos: producto_id, tipo, cantidad son requeridos.' });
  }
  if (!['entrada', 'salida'].includes(tipo)) {
    return res.status(400).json({ error: 'tipo debe ser "entrada" o "salida".' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'cantidad debe ser mayor a 0.' });
  }

  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(producto_id);
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const stockRow = db.prepare('SELECT * FROM stock_actual WHERE producto_id = ?').get(producto_id);
  const stockActualNum = stockRow ? stockRow.cantidad_actual : 0;

  if (tipo === 'salida' && cantidad > stockActualNum) {
    return res.status(400).json({
      error: `Stock insuficiente. Stock actual: ${stockActualNum}, se intentó retirar: ${cantidad}.`,
    });
  }

  const nuevoStock = tipo === 'entrada' ? stockActualNum + cantidad : stockActualNum - cantidad;

  db.exec('BEGIN');
  try {
    db.prepare(`
      INSERT INTO movimientos (producto_id, tipo, cantidad, usuario)
      VALUES (?, ?, ?, ?)
    `).run(producto_id, tipo, cantidad, usuario || 'admin');

    if (stockRow) {
      db.prepare(`
        UPDATE stock_actual SET cantidad_actual = ?, ultima_actualizacion = CURRENT_TIMESTAMP
        WHERE producto_id = ?
      `).run(nuevoStock, producto_id);
    } else {
      db.prepare(`
        INSERT INTO stock_actual (producto_id, cantidad_actual) VALUES (?, ?)
      `).run(producto_id, nuevoStock);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  res.status(201).json({
    mensaje: 'Movimiento registrado correctamente.',
    producto: producto.nombre,
    tipo,
    cantidad,
    stock_anterior: stockActualNum,
    stock_nuevo: nuevoStock,
  });
});

// ---------------------------------------------------------------------------


app.listen(PORT, () => {
  console.log(`StockFácil backend corriendo en http://localhost:${PORT}`);
});
