// src/components/UI/ArchitectureDiagram.tsx
import React from 'react';
import type { ArchitectureLayer, DataFlow } from '../../types';

interface ArchitectureDiagramProps {
  layers: ArchitectureLayer[];
  dataFlow: DataFlow[];
  size?: 'small' | 'medium' | 'large' | 'wide';
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ 
  layers, 
  dataFlow, 
  size = 'medium' 
}) => {
  return (
    <div className={`architecture-diagram tile size-${size}`}>
      <h3>System Architecture Overview</h3>
      <div className="diagram-container">
        <div className="layers-grid">
          {layers.map((layer, index) => (
            <div key={index} className="architecture-layer" style={{ borderLeftColor: layer.color }}>
              <div className="layer-header" style={{ backgroundColor: layer.color }}>
                <h4>{layer.name}</h4>
              </div>
              <div className="layer-components">
                {layer.components.map((component, compIndex) => (
                  <div key={compIndex} className="component">
                    {component}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="data-flows">
          <h4>Data Flow</h4>
          {dataFlow.map((flow, index) => (
            <div key={index} className="data-flow">
              <span className="flow-from">{flow.from}</span>
              <div className="flow-arrow">→</div>
              <span className="flow-to">{flow.to}</span>
              <div className="flow-type">{flow.type}</div>
              <div className="flow-data">{flow.data}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
