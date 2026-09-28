import { useEffect, useState } from 'react';
import { getProductos, postProducto } from '../api.js';

export default function AgregarScreen({ onSaved }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);

  async function cargarCategorias() {
    try {
      const productos = await getProductos();
      setCategoriasExistentes([...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es')));
    } catch {
      // si falla, el campo sigue funcionando como texto libre
    }
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  const formValido = nombre.trim() && categoria.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      // Si el texto coincide con una categoría existente (sin importar mayúsculas), se usa esa
      // para no crear duplicados como "bebidas" y "Bebidas".
      const categoriaLimpia = categoria.trim();
      const existente = categoriasExistentes.find((c) => c.toLowerCase() === categoriaLimpia.toLowerCase());

      await postProducto({
        nombre: nombre.trim(),
        categoria: existente || categoriaLimpia,
        stock_inicial: Number(stockInicial) || 0,
        precio_compra: Number(precioCompra) || 0,
        precio_venta: Number(precioVenta) || 0,
      });
      setSuccess(`Producto "${nombre}" creado correctamente.`);
      setNombre(''); setCategoria(''); setStockInicial(''); setPrecioCompra(''); setPrecioVenta('');
      cargarCategorias();
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Agregar Producto</h1>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nombre del producto <span className="req">*</span></label>
          <input
            type="text"
            placeholder="Ej: Coca-Cola Original 1.5L"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Categoría <span className="req">*</span></label>
          <input
            type="text"
            placeholder="Ej: Bebidas"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          {categoriasExistentes.length > 0 && (
            <div className="cat-chips">
              {categoriasExistentes.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter ${categoria.trim().toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label>Stock inicial</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={stockInicial}
            onChange={(e) => setStockInicial(e.target.value)}
          />
        </div>

        <div className="money-row">
          <div className="field">
            <label>Precio de compra</label>
            <input type="number" min="0" placeholder="$ 0" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
          </div>
          <div className="field">
            <label>Precio de venta</label>
            <input type="number" min="0" placeholder="$ 0" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn green" disabled={!formValido || saving}>
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  );
}
