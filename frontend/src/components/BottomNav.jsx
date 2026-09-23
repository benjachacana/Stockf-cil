export default function BottomNav({ current, onChange }) {
  const items = [
    { id: 'inventario', label: 'Inventario', icon: '📦' },
    { id: 'agregar', label: 'Agregar', icon: '➕' },
    { id: 'registrar', label: 'Registrar', icon: '📋' },
  ];

  return (
    <nav className="bottomnav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`navitem ${current === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
