// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import './styles/components/layout.css';
import './styles/components/tiles.css';
import './styles/components/simulation.css';
import './styles/components/ui.css';
import './styles/pages/security.css';
import './styles/pages/validation.css';
import './styles/pages/geometry.css';
import './styles/pages/fusion.css';
import './styles/pages/backend.css';
import './styles/pages/flows.css';
import './styles/pages/offline.css';
import './styles/pages/roles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);