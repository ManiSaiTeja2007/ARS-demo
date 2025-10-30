// src/components/Common/DiagramTile.tsx
import React from 'react';

interface DiagramTileProps {
  title: string;
  description: string;
  diagram: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
}

const DiagramTile: React.FC<DiagramTileProps> = ({
  title,
  description,
  diagram,
  size = 'medium'
}) => {
  return (
    <div className={`diagram-tile tile size-${size}`}>
      <h3>{title}</h3>
      <p className="diagram-description">{description}</p>
      <div className="diagram-content">
        <pre>{diagram}</pre>
      </div>
    </div>
  );
};

export default DiagramTile;
