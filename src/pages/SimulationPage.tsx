// src/pages/SimulatorPage.tsx (New page)
// (Extending original Simulation.tsx with blueprint specifics like separate port, MAC prefix)
import React from 'react';
// Import original Simulation components and enhance

const SimulatorPage: React.FC = () => {
  // Similar to original Simulation, but add notes
  return (
    <div className="page">
      <h1>Simulator</h1>
      <p>Separate port, emulates rovers, leaders, RSSI, packet loss. MAC prefix for simulated units.</p>
      {/* Embed enhanced simulation canvas here */}
      <div className="simulation-canvas">
        {/* Original simulation code */}
      </div>
      <p>Controls: Add/remove rovers, obstacles, simulate churn.</p>
    </div>
  );
};

export default SimulatorPage;