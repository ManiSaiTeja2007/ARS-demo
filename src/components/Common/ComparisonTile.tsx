// src/components/Common/ComparisonTile.tsx
import React from 'react';

interface Comparison {
  aspect: string;
  autonomous: string;
  semiAuto: string;
  manual: string;
}

interface ComparisonTileProps {
  title: string;
  comparisons: Comparison[];
  size?: 'small' | 'medium' | 'large' | 'wide';
}

const ComparisonTile: React.FC<ComparisonTileProps> = ({
  title,
  comparisons,
  size = 'medium'
}) => {
  return (
    <div className={`comparison-tile tile size-${size}`}>
      <h3>{title}</h3>
      <div className="comparison-table">
        <div className="comparison-header">
          <div className="header-cell">Aspect</div>
          <div className="header-cell">Autonomous</div>
          <div className="header-cell">Semi-Auto</div>
          <div className="header-cell">Manual</div>
        </div>
        {comparisons.map((comp, index) => (
          <div key={index} className="comparison-row">
            <div className="row-cell aspect">{comp.aspect}</div>
            <div className="row-cell autonomous">{comp.autonomous}</div>
            <div className="row-cell semi-auto">{comp.semiAuto}</div>
            <div className="row-cell manual">{comp.manual}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonTile;
