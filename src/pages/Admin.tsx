import React from 'react';
import StatCard from '../components/Common/StatCard';
import FeatureCard from '../components/Common/FeatureCard';

const Admin: React.FC = () => {
  return (
    <div className="page">
      <h1>Admin Policies & Safeguards</h1>
      <p>Configurable settings and monitoring.</p>
      <div className="tile-grid">
        <div className="tile-row">
          <StatCard
            value="60s"
            label="Provisional Timeout"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <FeatureCard
            title="Retention"
            description="No auto-prune; optional 30-day archive."
            size="small"
          />
          <FeatureCard
            title="Prune Order"
            description="Configurable: sleep → scout → noncritical."
            size="small"
          />
        </div>
        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Hard Reset</h3>
            <p>Admin action to rebuild roster from DB.</p>
            <button style={{ 
              background: '#e53e3e', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Execute Hard Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;