import { useEffect, useState } from 'react';
import { getProductos } from '../api.js';

const badgeConfig = {
  en_stock: { label: 'En Stock', className: 'ok' },
  bajo: { label: 'Stock Bajo', className: 'low' },
  agotado: { label: 'Agotado', className: 'out' },
};

export default function InventarioScreen() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  async function cargar() {
    setLoading(true);
    setError('');
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (loading) return <div className="screen"><div className="loading">Cargando inventario...</div></div>;
  if (error) return <div className="screen"><div className="error-msg">{error}</div></div>;

  const total = productos.length;
  const enStock = productos.filter((p) => p.estado === 'en_stock').length;
  const bajo = productos.filter((p) => p.estado === 'bajo').length;
  const agotado = productos.filter((p) => p.estado === 'agotado').length;
  const atencion = bajo + agotado;

  const categorias = ['Todos', ...new Set(productos.map((p) => p.categoria))];
  const visibles = filtro === 'Todos' ? productos : productos.filter((p) => p.categoria === filtro);

  return (
    <div className="screen">
      <div className="inv-top-row">
        <div>
          <div className="inv-title">Mi Minimarket</div>
          <div className="inv-sub">Rancagua</div>
        </div>
      </div>

      {atencion > 0 && (
        <div className="alert-banner">
          <div className="alert-badge">!</div>
          <div className="alert-text">
            <b>{atencion} producto{atencion !== 1 ? 's' : ''} requiere{atencion === 1 ? '' : 'n'} tu atención</b>
            <span>{agotado} agotado{agotado !== 1 ? 's' : ''} · {bajo} con stock bajo</span>
          </div>
        </div>
      )}

      <div className="metric-row">
        <div className="metric total"><div className="num">{total}</div><div className="lbl">Total</div></div>
        <div className="metric stock"><div className="num">{enStock}</div><div className="lbl">Stock</div></div>
        <div className="metric low"><div className="num">{bajo}</div><div className="lbl">Bajo</div></div>
        <div className="metric out"><div className="num">{agotado}</div><div className="lbl">Agotado</div></div>
      </div>

      <div className="filters">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`filter ${filtro === cat ? 'active' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-lbl">PRODUCTOS</div>
      <div className="product-list">
        {visibles.map((p) => {
          const badge = badgeConfig[p.estado];
          const isWarn = p.estado !== 'en_stock';
          return (
            <div key={p.id} className={`product-card ${isWarn ? 'warn' : ''}`}>
              <div className="thumb" />
              <div className="pinfo">
                <div className="pname">{p.nombre}</div>
                <div className="pcat">{p.categoria}</div>
              </div>
              <div className="pstock">
                <div className="puds">{p.stock} <span>uds</span></div>
                <div className={`badge ${badge.className}`}>{badge.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
