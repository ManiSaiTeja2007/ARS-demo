// src/components/UI/ValidationPipeline.tsx (New component)
import React from 'react';

const ValidationPipeline: React.FC = () => {
  const steps = [
    '1. Time-window check (±0.2s normal, ±1s priority)',
    '2. MAC lookup & registration check',
    '3. Hash verification (HMAC-SHA256)',
    '4. Duplicate detection (Redis/Bloom)',
    '5. Proximity gating (5m from raw sweeps)',
    '6. Enqueue & persist (Redis stream)',
    '7. Priority handling (TTL 60s, priority stream)',
    '8. Worker pickup',
  ];

  return (
    <div className="pipeline-steps">
      <h3>Ingress Validation Pipeline</h3>
      {steps.map((step, index) => (
        <div key={index} className="pipeline-step">{step}</div>
      ))}
    </div>
  );
};

export default ValidationPipeline;