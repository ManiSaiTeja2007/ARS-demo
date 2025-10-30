// src/components/Layout/Navigation.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pages = [
    { id: '/', name: 'Overview', icon: '🏠' },
    { id: '/simulation', name: 'Theoretical Simulation', icon: '🎮' },
    { id: '/architecture', name: 'Architecture', icon: '🏗️' },
    { id: '/communication', name: 'Communication', icon: '📡' },
    { id: '/sensors', name: 'Sensors & Mapping', icon: '📊' },
    { id: '/components', name: 'Components', icon: '⚙️' },
    { id: '/modes', name: 'Operating Modes', icon: '🔄' },
    { id: '/security', name: 'Security', icon: '🔒' },
    { id: '/validation', name: 'Validation', icon: '✅' },
    { id: '/geometry', name: 'Geometry', icon: '📐' },
    { id: '/fusion', name: 'Fusion', icon: '🔄' },
    { id: '/backend', name: 'Backend', icon: '⚡' },
    { id: '/flows', name: 'Flows', icon: '🌊' },
    { id: '/future', name: 'Future Enhancements', icon: '🚀' }
  ];

  const currentPage = location.pathname;

  return (
    <nav className="navigation">
      {pages.map(page => (
        <button
          key={page.id}
          className={`nav-btn ${currentPage === page.id ? 'active' : ''}`}
          onClick={() => navigate(page.id)}
        >
          <span className="nav-icon">{page.icon}</span>
          {page.name}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;