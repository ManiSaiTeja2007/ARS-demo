// src/pages/Future.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import TimelineTile from '../components/Common/TimelineTile';

const Future: React.FC = () => {
  return (
    <div className="page future-page">
      <div className="page-header">
        <h1>Future Enhancements</h1>
        <p className="page-description">
          Roadmap for advanced features, AI integration, and scalability improvements 
          for next-generation swarm robotics
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="AI & Machine Learning"
            description="Advanced pattern recognition, predictive analytics, and adaptive swarm behavior"
            icon="🧠"
            color="#2dd4bf"
            size="medium"
          >
            <div className="enhancement-features">
              <div className="feature">Neural Network-Based Navigation</div>
              <div className="feature">Predictive Obstacle Avoidance</div>
              <div className="feature">Swarm Learning & Adaptation</div>
              <div className="feature">Anomaly Detection</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Advanced Sensors"
            description="Enhanced sensing capabilities with LIDAR, thermal imaging, and environmental monitoring"
            icon="📡"
            color="#60a5fa"
            size="medium"
          >
            <div className="enhancement-features">
              <div className="feature">LIDAR for Precision Mapping</div>
              <div className="feature">Thermal Imaging Cameras</div>
              <div className="feature">Multi-spectral Sensors</div>
              <div className="feature">Gas & Chemical Detection</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Extended Applications"
            description="Broader deployment scenarios and specialized mission capabilities"
            icon="🚀"
            color="#f59e0b"
            size="medium"
          >
            <div className="enhancement-features">
              <div className="feature">Underwater Exploration</div>
              <div className="feature">Aerial-Surface Hybrid</div>
              <div className="feature">Planetary Rovers</div>
              <div className="feature">Search & Rescue Drones</div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <TimelineTile
            title="Development Roadmap"
            milestones={[
              {
                phase: "Phase 1",
                title: "Core System Completion",
                description: "Basic swarm functionality with BeeAdHoc networking",
                status: "completed",
                date: "Q4 2024"
              },
              {
                phase: "Phase 2", 
                title: "AI Integration",
                description: "Machine learning for adaptive behavior",
                status: "in-progress",
                date: "Q2 2025"
              },
              {
                phase: "Phase 3",
                title: "Advanced Sensors",
                description: "LIDAR and multi-spectral integration",
                status: "planned", 
                date: "Q4 2025"
              },
              {
                phase: "Phase 4",
                title: "Commercial Deployment",
                description: "Large-scale swarm applications",
                status: "planned",
                date: "Q2 2026"
              }
            ]}
            size="wide"
          />
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Research & Development Focus</h3>
            <div className="research-areas">
              <div className="research-area">
                <h4>Swarm Intelligence</h4>
                <ul>
                  <li>Distributed decision making algorithms</li>
                  <li>Emergent behavior patterns</li>
                  <li>Scalability to 1000+ nodes</li>
                  <li>Cross-species swarm coordination</li>
                </ul>
              </div>
              <div className="research-area">
                <h4>Energy Efficiency</h4>
                <ul>
                  <li>Solar power integration</li>
                  <li>Wireless charging capabilities</li>
                  <li>Energy harvesting from environment</li>
                  <li>Ultra-low-power sleep modes</li>
                </ul>
              </div>
              <div className="research-area">
                <h4>Communication</h4>
                <ul>
                  <li>Quantum-secure communication</li>
                  <li>Satellite mesh networking</li>
                  <li>Underwater acoustic communication</li>
                  <li>Inter-planetary delay-tolerant networks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Future;
