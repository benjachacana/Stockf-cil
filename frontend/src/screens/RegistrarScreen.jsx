import { useEffect, useState } from 'react';
import { getProductos, postMovimiento } from '../api.js';

export default function RegistrarScreen({ onSaved }) {
  const [productos, setProductos] = useState([]);
  const [tipo, setTipo] = useState('entrada');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductos().then(setProductos).catch((err) => setError(err.message));
  }, []);

  const productoSeleccionado = productos.find((p) => String(p.id) === String(productoId));
  const cantidadNum = Number(cantidad) || 0;
  const stockResultante = productoSeleccionado
    ? tipo === 'entrada'
      ? productoSeleccionado.stock + cantidadNum
      : productoSeleccionado.stock - cantidadNum
    : null;

  const formValido = productoId && cantidadNum > 0 && (tipo === 'entrada' || stockResultante >= 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const resultado = await postMovimiento({ producto_id: Number(productoId), tipo, cantidad: cantidadNum });
      setSuccess(`Movimiento guardado: ${resultado.producto} — stock ${resultado.stock_anterior} → ${resultado.stock_nuevo}`);
      setProductoId('');
      setCantidad('');
      const data = await getProductos();
      setProductos(data);
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
        <h1>Registrar movimiento</h1>
      </div>

      <div className="toggle-row">
        <button
          type="button"
          className={`toggle-btn entrada ${tipo === 'entrada' ? 'active' : ''}`}
          onClick={() => setTipo('entrada')}
        >
          Entrada
        </button>
        <button
          type="button"
          className={`toggle-btn salida ${tipo === 'salida' ? 'active' : ''}`}
          onClick={() => setTipo('salida')}
        >
          Salida
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className={`field ${tipo}`}>
          <label>Producto <span className="req">*</span></label>
          <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} — {p.stock} uds</option>
            ))}
          </select>
        </div>

        <div className={`field ${tipo}`}>
          <label>{tipo === 'salida' ? 'Cantidad a retirar' : 'Cantidad'} <span className="req">*</span></label>
          <input
            type="number"
            min="1"
            placeholder="Ej: 10"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        {tipo === 'entrada' ? (
          <div className="field">
            <label>Stock resultante</label>
            <input type="text" value={stockResultante ?? 0} disabled />
          </div>
        ) : (
          productoSeleccionado && cantidadNum > 0 && (
            <div className="preview-box">
              <div className="lbl">Actualización de inventario estimado</div>
              <div className="val">
                {productoSeleccionado.stock} → {stockResultante} uds ({stockResultante - productoSeleccionado.stock})
              </div>
            </div>
          )
        )}

        <button type="submit" className={`btn ${tipo === 'salida' ? 'red' : 'green'}`} disabled={!formValido || saving}>
          {saving ? 'Guardando...' : 'Guardar movimiento'}
        </button>
      </form>
    </div>
  );
}
