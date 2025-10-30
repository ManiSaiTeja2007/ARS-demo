// src/components/UI/ComponentGrid.tsx
import React from 'react';
import type { SystemComponent } from '../../types';

interface ComponentGridProps {
  components: SystemComponent[];
}

const ComponentGrid: React.FC<ComponentGridProps> = ({ components }) => {
  return (
    <div className="component-grid tile size-wide">
      <h3>Hardware Components</h3>
      <div className="components-list">
        {components.map((component, index) => (
          <div key={index} className="component-card">
            <div className="component-header">
              <h4>{component.name}</h4>
              <div className={`component-status status-${component.status}`}>
                {component.status.toUpperCase()}
              </div>
            </div>
            <p className="component-description">{component.description}</p>
            <div className="component-specs">
              {component.specifications.map((spec, specIndex) => (
                <div key={specIndex} className="spec">
                  {spec}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentGrid;
