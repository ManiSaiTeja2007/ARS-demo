// src/pages/Admin.tsx (New page)
import React from 'react';

const Admin: React.FC = () => {
  return (
    <div className="page">
      <h1>Admin Policies & Safeguards</h1>
      <p>Configurable settings and monitoring.</p>
      <StatCard title="Provisional Timeout" value="60s" description="One-time key validity." />
      <FeatureCard title="Retention" description="No auto-prune; optional 30-day archive." />
      <FeatureCard title="Prune Order" description="Configurable: sleep → scout → noncritical." />
      <p>Hard reset: Rebuild roster from DB.</p>
    </div>
  );
};

export default Admin;