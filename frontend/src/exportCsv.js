const ESTADOS = {
  en_stock: 'En stock',
  bajo: 'Stock bajo',
  agotado: 'Agotado',
};

// Separador ";" porque Excel con configuración regional de Chile lo usa por defecto;
// con "," abriría todo en una sola columna.
const SEP = ';';

function celda(valor) {
  const texto = String(valor ?? '');
  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function fechaLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function exportarInventarioCsv(productos) {
  const encabezado = ['nombre', 'categoria', 'stock', 'precio_compra', 'precio_venta', 'estado'];
  const filas = productos.map((p) => [
    p.nombre,
    p.categoria,
    p.stock,
    p.precio_compra,
    p.precio_venta,
    ESTADOS[p.estado] || p.estado,
  ]);

  const contenido = [encabezado, ...filas].map((fila) => fila.map(celda).join(SEP)).join('\r\n');

  // BOM al inicio para que Excel interprete bien los acentos (UTF-8)
  const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventario_${fechaLocal()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
