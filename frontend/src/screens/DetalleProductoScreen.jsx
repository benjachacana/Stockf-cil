import { useEffect, useState } from 'react';
import { getMovimientos } from '../api.js';

const badgeConfig = {
  en_stock: { label: 'En Stock', className: 'ok' },
  bajo: { label: 'Stock Bajo', className: 'low' },
  agotado: { label: 'Agotado', className: 'out' },
};

function formatFecha(fecha) {
  if (!fecha) return '';
  // SQLite CURRENT_TIMESTAMP guarda la fecha en UTC sin 'T' ni 'Z' — se agregan
  // para que el navegador la interprete correctamente y la convierta a hora local.
  const d = new Date(fecha.replace(' ', 'T') + 'Z');
  return d.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetalleProductoScreen({ producto, onBack }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovimientos(producto.id)
      .then(setMovimientos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [producto.id]);

  const badge = badgeConfig[producto.estado];

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Volver">←</button>
        <h1>{producto.nombre}</h1>
      </div>

      <div className="detalle-info">
        <div className="detalle-cat">{producto.categoria}</div>
        <div className="detalle-stock-row">
          <div className="detalle-stock">
            {producto.stock} <span>uds en stock</span>
          </div>
          {badge && <div className={`badge ${badge.className}`}>{badge.label}</div>}
        </div>
        <div className="detalle-precios">
          <div>
            <span className="lbl">Compra</span>${producto.precio_compra}
          </div>
          <div>
            <span className="lbl">Venta</span>${producto.precio_venta}
          </div>
        </div>
      </div>

      <div className="section-lbl">HISTORIAL DE MOVIMIENTOS</div>

      {loading && <div className="loading">Cargando historial...</div>}
      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && movimientos.length === 0 && (
        <div className="loading">Sin movimientos registrados todavía.</div>
      )}

      <div className="mov-list">
        {movimientos.map((m) => (
          <div key={m.id} className="mov-row">
            <div className={`mov-icon ${m.tipo}`}>{m.tipo === 'entrada' ? '↑' : '↓'}</div>
            <div className="mov-info">
              <div className="mov-tipo">
                {m.tipo === 'entrada' ? 'Entrada' : 'Salida'} · {m.cantidad} uds
              </div>
              <div className="mov-fecha">
                {formatFecha(m.fecha)} · {m.usuario}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
