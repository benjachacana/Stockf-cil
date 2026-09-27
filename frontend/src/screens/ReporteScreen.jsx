import { useEffect, useState } from 'react';
import { getReporte } from '../api.js';

function formatFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha.replace(' ', 'T') + 'Z');
  return d.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReporteScreen() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getReporte()
      .then(setReporte)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="screen"><div className="loading">Cargando reporte...</div></div>;
  if (error) return <div className="screen"><div className="error-msg">{error}</div></div>;

  const { hoy, semana, top_movidos: topMovidos, ultimos_movimientos: ultimosMovimientos } = reporte;

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Reporte</h1>
      </div>

      <div className="section-lbl">HOY</div>
      <div className="metric-row">
        <div className="metric stock"><div className="num">{hoy.entradas}</div><div className="lbl">Entradas</div></div>
        <div className="metric out"><div className="num">{hoy.salidas}</div><div className="lbl">Salidas</div></div>
        <div className="metric total"><div className="num">{hoy.unidades_movidas}</div><div className="lbl">Uds. movidas</div></div>
      </div>

      <div className="section-lbl">ÚLTIMOS 7 DÍAS</div>
      <div className="metric-row">
        <div className="metric stock"><div className="num">{semana.entradas}</div><div className="lbl">Entradas</div></div>
        <div className="metric out"><div className="num">{semana.salidas}</div><div className="lbl">Salidas</div></div>
        <div className="metric total"><div className="num">{semana.unidades_movidas}</div><div className="lbl">Uds. movidas</div></div>
      </div>

      <div className="section-lbl">TOP 5 PRODUCTOS MÁS MOVIDOS</div>
      {topMovidos.length === 0 ? (
        <div className="loading">Todavía no hay movimientos registrados.</div>
      ) : (
        <div className="top-list">
          {topMovidos.map((t, i) => (
            <div key={t.producto_id} className="top-row">
              <div className="top-rank">{i + 1}</div>
              <div className="top-nombre">{t.nombre}</div>
              <div className="top-total">{t.total_movido} uds</div>
            </div>
          ))}
        </div>
      )}

      <div className="section-lbl">ÚLTIMOS MOVIMIENTOS</div>
      {ultimosMovimientos.length === 0 ? (
        <div className="loading">Sin movimientos todavía.</div>
      ) : (
        <div className="mov-list">
          {ultimosMovimientos.map((m) => (
            <div key={m.id} className="mov-row">
              <div className={`mov-icon ${m.tipo}`}>{m.tipo === 'entrada' ? '↑' : '↓'}</div>
              <div className="mov-info">
                <div className="mov-tipo">{m.nombre} · {m.cantidad} uds</div>
                <div className="mov-fecha">{formatFecha(m.fecha)} · {m.usuario}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
