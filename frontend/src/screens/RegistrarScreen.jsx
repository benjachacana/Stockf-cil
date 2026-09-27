import { useEffect, useState } from 'react';
import { getProductos, postMovimiento } from '../api.js';

const UMBRAL_CONFIRMACION = 50;

export default function RegistrarScreen({ onSaved }) {
  const [productos, setProductos] = useState([]);
  const [tipo, setTipo] = useState('entrada');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

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
  const requiereConfirmacion = tipo === 'salida' && cantidadNum >= UMBRAL_CONFIRMACION;

  function cambiarTipo(nuevoTipo) {
    setTipo(nuevoTipo);
    setConfirmando(false);
  }

  function cambiarProducto(id) {
    setProductoId(id);
    setConfirmando(false);
  }

  function cambiarCantidad(valor) {
    setCantidad(valor);
    setConfirmando(false);
  }

  async function guardarMovimiento() {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const resultado = await postMovimiento({ producto_id: Number(productoId), tipo, cantidad: cantidadNum });
      setSuccess(`Movimiento guardado: ${resultado.producto} — stock ${resultado.stock_anterior} → ${resultado.stock_nuevo}`);
      setProductoId('');
      setCantidad('');
      setConfirmando(false);
      const data = await getProductos();
      setProductos(data);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (requiereConfirmacion && !confirmando) {
      setConfirmando(true);
      return;
    }
    guardarMovimiento();
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
          onClick={() => cambiarTipo('entrada')}
        >
          Entrada
        </button>
        <button
          type="button"
          className={`toggle-btn salida ${tipo === 'salida' ? 'active' : ''}`}
          onClick={() => cambiarTipo('salida')}
        >
          Salida
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className={`field ${tipo}`}>
          <label>Producto <span className="req">*</span></label>
          <select value={productoId} onChange={(e) => cambiarProducto(e.target.value)}>
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
            onChange={(e) => cambiarCantidad(e.target.value)}
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

        {confirmando && (
          <div className="confirm-box">
            <div className="lbl">Confirmar salida grande</div>
            <div className="val">
              Vas a retirar {cantidadNum} uds de {productoSeleccionado?.nombre}. Esta es una salida
              de {UMBRAL_CONFIRMACION}+ unidades — confirma que es correcto antes de guardar.
            </div>
            <div className="confirm-actions">
              <button type="button" className="btn-secondary" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn red" disabled={saving}>
                {saving ? 'Guardando...' : 'Sí, confirmar salida'}
              </button>
            </div>
          </div>
        )}

        {!confirmando && (
          <button type="submit" className={`btn ${tipo === 'salida' ? 'red' : 'green'}`} disabled={!formValido || saving}>
            {saving ? 'Guardando...' : 'Guardar movimiento'}
          </button>
        )}
      </form>
    </div>
  );
}
