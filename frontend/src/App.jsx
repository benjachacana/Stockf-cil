import { useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import InventarioScreen from './screens/InventarioScreen.jsx';
import RegistrarScreen from './screens/RegistrarScreen.jsx';
import AgregarScreen from './screens/AgregarScreen.jsx';
import DetalleProductoScreen from './screens/DetalleProductoScreen.jsx';

export default function App() {
  const [tab, setTab] = useState('inventario');
  const [refreshKey, setRefreshKey] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  function handleSaved() {
    // fuerza a InventarioScreen a recargar la próxima vez que se muestre
    setRefreshKey((k) => k + 1);
  }

  if (productoSeleccionado) {
    return (
      <div className="app-shell">
        <DetalleProductoScreen
          producto={productoSeleccionado}
          onBack={() => setProductoSeleccionado(null)}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {tab === 'inventario' && (
        <InventarioScreen key={refreshKey} onSelectProducto={setProductoSeleccionado} />
      )}
      {tab === 'registrar' && <RegistrarScreen onSaved={handleSaved} />}
      {tab === 'agregar' && <AgregarScreen onSaved={handleSaved} />}
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}
