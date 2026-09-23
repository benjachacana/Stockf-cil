import { useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import InventarioScreen from './screens/InventarioScreen.jsx';
import RegistrarScreen from './screens/RegistrarScreen.jsx';
import AgregarScreen from './screens/AgregarScreen.jsx';

export default function App() {
  const [tab, setTab] = useState('inventario');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSaved() {
    // fuerza a InventarioScreen a recargar la próxima vez que se muestre
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app-shell">
      {tab === 'inventario' && <InventarioScreen key={refreshKey} />}
      {tab === 'registrar' && <RegistrarScreen onSaved={handleSaved} />}
      {tab === 'agregar' && <AgregarScreen onSaved={handleSaved} />}
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}
