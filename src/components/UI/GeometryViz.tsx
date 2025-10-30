// src/components/UI/GeometryViz.tsx (New component)
import React, { useMemo } from 'react';
import { generateAlphaShape } from '../../utils/diagramUtils';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip } from 'recharts';

const GeometryViz: React.FC = () => {
  const shape = useMemo(() => generateAlphaShape(600), []);  // Simulate >500 points for downsampling

  return (
    <div className="geometry-canvas">
      <h3>Alpha-Shape Aggregation (500-point cap with downsampling)</h3>
      <ScatterChart width={400} height={300}>
        <XAxis type="number" dataKey="x" />
        <YAxis type="number" dataKey="y" />
        <Tooltip />
        <Scatter name="Points" data={shape.points} fill="#8884d8" shape="circle" />
        <Scatter name="Hull" data={shape.hull} fill="#82ca9d" shape="star" />
      </ScatterChart>
      <p>{shape.downsampled ? 'Downsampled to 500 points' : 'Full points used'}</p>
      <p>Aggregation: Polar → Cartesian → Rotate/Translate → Cap 500 → Alpha Shape → Simplify → PostGIS</p>
    </div>
  );
};

export default GeometryViz;