import { useState } from 'react';
import { postProducto } from '../api.js';

export default function AgregarScreen({ onSaved }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const formValido = nombre.trim() && categoria.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await postProducto({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        stock_inicial: Number(stockInicial) || 0,
        precio_compra: Number(precioCompra) || 0,
        precio_venta: Number(precioVenta) || 0,
      });
      setSuccess(`Producto "${nombre}" creado correctamente.`);
      setNombre(''); setCategoria(''); setStockInicial(''); setPrecioCompra(''); setPrecioVenta('');
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
