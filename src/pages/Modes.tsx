// src/pages/Modes.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import ComparisonTile from '../components/Common/ComparisonTile';

const Modes: React.FC = () => {
  return (
    <div className="page modes-page">
      <div className="page-header">
        <h1>Operating Modes</h1>
        <p className="page-description">
          Multi-modal operation with autonomous, semi-autonomous, and manual control, 
          featuring gesture control and fault tolerance
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="Autonomous Mode"
            description="Fully independent operation with sensor fusion, obstacle avoidance, and collaborative mapping"
            icon="🤖"
            color="#2dd4bf"
            size="medium"
          >
            <div className="mode-features">
              <div className="feature">Sensor Fusion & Kalman Filtering</div>
              <div className="feature">Predictive Obstacle Avoidance</div>
              <div className="feature">Collaborative 3D Mapping</div>
              <div className="feature">BeeAdHoc Swarm Coordination</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Semi-Autonomous Mode"
            description="Swarm coordination with decentralized decision making and chain-based communication"
            icon="🔄"
            color="#60a5fa"
            size="medium"
          >
            <div className="mode-features">
              <div className="feature">Decentralized Chain Communication</div>
              <div className="feature">Role-Based Task Allocation</div>
              <div className="feature">Adaptive Sleep Modes</div>
              <div className="feature">Backend-Independent Operation</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Manual Mode"
            description="Direct control with gesture input, backend commands, and fault-tolerant operation"
            icon="🎮"
            color="#f59e0b"
            size="medium"
          >
            <div className="mode-features">
              <div className="feature">Gesture Control (MPU6050 Glove)</div>
              <div className="feature">Backend Command Override</div>
              <div className="feature">Fault-Tolerant Sliding Mode Control</div>
              <div className="feature">Real-time Telemetry</div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <ComparisonTile
            title="Mode Comparison"
            comparisons={[
              {
                aspect: "Control Type",
                autonomous: "Fully Autonomous",
                semiAuto: "Swarm Coordinated", 
                manual: "Human Controlled"
              },
              {
                aspect: "Communication",
                autonomous: "Local Mesh Only",
                semiAuto: "Decentralized Chains",
                manual: "Direct Backend Link"
              },
              {
                aspect: "Power Usage",
                autonomous: "Medium",
                semiAuto: "Low (Sleep Modes)",
                manual: "High"
              },
              {
                aspect: "Latency",
                autonomous: "<50ms",
                semiAuto: "<100ms", 
                manual: "<20ms"
              },
              {
                aspect: "Use Case",
                autonomous: "Exploration",
                semiAuto: "Monitoring",
                manual: "Precision Tasks"
              }
            ]}
            size="wide"
          />
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Gesture Control System</h3>
            <div className="gesture-system">
              <div className="gesture-component">
                <h4>Hardware</h4>
                <ul>
                  <li>MPU6050 IMU Sensor</li>
                  <li>Wireless Communication Module</li>
                  <li>Battery Power Supply</li>
                  <li>Ergonomic Glove Design</li>
                </ul>
              </div>
              <div className="gesture-component">
                <h4>Software</h4>
                <ul>
                  <li>Tilt-Based Command Recognition</li>
                  <li>Sliding Mode Fault Tolerance</li>
                  <li>Gesture Calibration System</li>
                  <li>Real-time Feedback</li>
                </ul>
              </div>
              <div className="gesture-component">
                <h4>Performance</h4>
                <ul>
                  <li>Response Time: &lt;10ms</li>
                  <li>Accuracy: ±2°</li>
                  <li>Range: 50m Line-of-Sight</li>
                  <li>Battery Life: 8+ hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modes;
