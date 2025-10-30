// src/components/Common/SpecificationTile.tsx
import React from 'react';

interface SpecificationTileProps {
  title: string;
  specifications: string[];
  status: 'operational' | 'degraded' | 'offline';
  size?: 'small' | 'medium' | 'large';
}

const SpecificationTile: React.FC<SpecificationTileProps> = ({
  title,
  specifications,
  status,
  size = 'medium'
}) => {
  return (
    <div className={`specification-tile tile size-${size}`}>
      <div className="spec-header">
        <h3>{title}</h3>
        <div className={`status-indicator status-${status}`}>
          {status.toUpperCase()}
        </div>
      </div>
      <div className="specifications">
        {specifications.map((spec, index) => (
          <div key={index} className="specification">
            {spec}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificationTile;
