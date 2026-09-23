const API_URL = 'http://localhost:3001';

export async function getProductos() {
  const res = await fetch(`${API_URL}/api/productos`);
  if (!res.ok) throw new Error('No se pudo cargar la lista de productos.');
  return res.json();
}

export async function getMovimientos(productoId) {
  const url = productoId
    ? `${API_URL}/api/movimientos?producto_id=${productoId}`
    : `${API_URL}/api/movimientos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo cargar el historial de movimientos.');
  return res.json();
}

export async function postMovimiento({ producto_id, tipo, cantidad }) {
  const res = await fetch(`${API_URL}/api/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_id, tipo, cantidad }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar el movimiento.');
  return data;
}

export async function postProducto({ nombre, categoria, stock_inicial, precio_compra, precio_venta }) {
  const res = await fetch(`${API_URL}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, categoria, stock_inicial, precio_compra, precio_venta }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear el producto.');
  return data;
}
