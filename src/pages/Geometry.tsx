// src/pages/Geometry.tsx
import React from 'react';
import GeometryViz from '../components/UI/GeometryViz';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';
import TimelineTile from '../components/Common/TimelineTile';

const Geometry: React.FC = () => {
  const processingSteps = [
    {
      phase: "Step 1",
      title: "Polar to Cartesian Conversion",
      description: "Convert sweep data from polar coordinates to local Cartesian using r and θ_rel",
      status: "completed" as const,
      date: "Per sample"
    },
    {
      phase: "Step 2",
      title: "Coordinate Transformation",
      description: "Rotate by heading_deg and translate by pose.x,y to global coordinates",
      status: "completed" as const,
      date: "Per sample"
    },
    {
      phase: "Step 3",
      title: "Multi-rover Aggregation",
      description: "Combine points from active scouts/foragers within 5s snapshot window",
      status: "completed" as const,
      date: "5s window"
    },
    {
      phase: "Step 4",
      title: "Point Capping (500 max)",
      description: "Uniform downsampling if exceeding 500 points to bound computation",
      status: "completed" as const,
      date: "When >500 pts"
    },
    {
      phase: "Step 5",
      title: "Outlier Filtering",
      description: "Apply median/z-score methods to remove noise and errors",
      status: "completed" as const,
      date: "Per aggregation"
    },
    {
      phase: "Step 6",
      title: "Alpha Shape Computation",
      description: "Generate concave hull with auto-tuned alpha parameter",
      status: "completed" as const,
      date: "GEOS/Shapely"
    },
    {
      phase: "Step 7",
      title: "Polygon Simplification",
      description: "Simplify geometry while preserving shape characteristics",
      status: "completed" as const,
      date: "Shapely simplify"
    },
    {
      phase: "Step 8",
      title: "PostGIS Persistence",
      description: "Store with provenance: rover_ids, timestamps, confidence",
      status: "completed" as const,
      date: "Database"
    }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Sensing & Alpha-Shape Geometry</h1>
        <p className="page-description">
          Multi-rover aggregation with 500-point cap, uniform downsampling, and concave hull computation
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <div className="tile size-wide">
            <GeometryViz />
          </div>
        </div>

        <div className="tile-row">
          <StatCard
            value="±15°"
            label="Sweep Angle"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="30 samples"
            label="Sweep Resolution"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="cm"
            label="Distance Units"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="500"
            label="Point Cap"
            suffix=" points"
            size="small"
            color="#ef4444"
          />
        </div>

        <div className="tile-row">
          <TimelineTile
            title="Geometry Processing Pipeline"
            milestones={processingSteps}
            size="wide"
          />
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Uniform Downsampling"
            description="Intelligent point reduction while preserving spatial distribution"
            icon="📊"
            color="#10b981"
            size="medium"
          >
            <div className="downsampling-info">
              <p><strong>Algorithm:</strong> Uniform selection maintains point distribution</p>
              <div className="downsample-example">
                <div className="point-count">
                  <span className="count-before">1000+ points</span>
                  <span className="arrow">→</span>
                  <span className="count-after">500 points</span>
                </div>
                <div className="benefits">
                  <h5>Benefits:</h5>
                  <ul>
                    <li>Bounded computation time</li>
                    <li>Preserved obstacle shapes</li>
                    <li>Predictable memory usage</li>
                    <li>Real-time performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Alpha Shape Parameters"
            description="Auto-tuned concave hull generation for obstacle mapping"
            icon="🔺"
            color="#8b5cf6"
            size="medium"
          >
            <div className="alpha-parameters">
              <div className="parameter">
                <label>Alpha Value:</label>
                <span>Auto-tuned or admin setting</span>
              </div>
              <div className="parameter">
                <label>Input Points:</label>
                <span>Active scouts/foragers only</span>
              </div>
              <div className="parameter">
                <label>Aggregation Window:</label>
                <span>5 seconds (configurable)</span>
              </div>
              <div className="parameter">
                <label>Provenance Tracking:</label>
                <span>rover_ids, timestamps, confidence</span>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default Geometry;