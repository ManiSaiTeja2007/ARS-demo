// src/pages/Home.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Home: React.FC = () => {
  return (
    <div className="page home-page">
      <div className="page-header">
        <h1>Autonomous Rover Swarm System</h1>
        <p className="page-description">
          Advanced decentralized swarm robotics platform with BeeAdHoc mesh networking, 
          predictive obstacle avoidance, and multi-modal operation for exploration and monitoring applications.
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="Advanced Mesh Networking"
            description="Localized BeeAdHoc protocol with scout/forager roles, RSSI-based neighbor selection, and adaptive sleep modes"
            icon="🕸️"
            color="#2dd4bf"
            size="medium"
          />
          <FeatureCard
            title="Swarm Intelligence"
            description="Decentralized decision making with leader election, dynamic role assignment, and collaborative mapping"
            icon="🤝"
            color="#60a5fa"
            size="medium"
          />
          <FeatureCard
            title="Multi-Layer Architecture"
            description="Four-layer architecture with Python Tkinter GUI master, NodeMCU mesh layer, Arduino control, and physical sensors"
            icon="🏗️"
            color="#f59e0b"
            size="medium"
          />
        </div>

        <div className="tile-row">
          <StatCard
            value="70-90%"
            label="Network Load Reduction"
            suffix=""
            size="small"
          />
          <StatCard
            value="50%+"
            label="Power Savings"
            suffix=""
            size="small"
          />
          <StatCard
            value="<100ms"
            label="Mesh Latency"
            suffix=""
            size="small"
          />
          <StatCard
            value="10-50"
            label="Scalable Nodes"
            suffix=""
            size="small"
          />
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>System Overview</h3>
            <div className="system-overview">
              <p>
                The Autonomous Rover Swarm System implements an <strong>Advanced Multi-Layer Decentralized Ad Hoc Mesh Architecture</strong> 
                enhanced with <strong>Localized BeeAdHoc</strong> protocols for scalable swarm operations. The system features:
              </p>
              <ul>
                <li><strong>Master Layer</strong>: Python Tkinter GUI with voting-based leader election and gesture control integration</li>
                <li><strong>Mesh Layer</strong>: NodeMCU ESP8266 with BeeAdHoc protocol, RSSI-based neighbor selection, and MAC registry security</li>
                <li><strong>Control Layer</strong>: Arduino UNO R3 with sensor fusion, Kalman filtering, and SHA-1 security</li>
                <li><strong>Physical Layer</strong>: HC-SR04 ultrasonic, MPU6050 IMU, SG90 servo, and L298N motor drivers</li>
              </ul>
              <p>
                The system achieves <strong>70-90% network load reduction</strong> and <strong>50%+ power savings</strong> through 
                localized communication chains and adaptive sleep modes, supporting applications in disaster response, 
                environmental monitoring, and space exploration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
