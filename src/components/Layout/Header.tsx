// src/components/Layout/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo">ARS</div>
      <div className="header-content">
        <h1>Autonomous Rover Swarm System</h1>
        <p className="lead">
          Advanced Multi-Layer Decentralized Ad Hoc Mesh Architecture with Localized BeeAdHoc Enhancement
        </p>
      </div>
    </header>
  );
};

export default Header;
