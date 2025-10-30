// src/components/Common/FlowDiagram.tsx (New component)
import React from 'react';
import type { FlowStep } from '../../types';

interface FlowDiagramProps {
  steps: FlowStep[];
  title: string;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ steps, title }) => {
  return (
    <div className="flow-diagram">
      <h3>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flow-node" title={step.description}>
              {step.label} ({step.actor})
            </div>
            {index < steps.length - 1 && <span className="flow-arrow">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FlowDiagram;