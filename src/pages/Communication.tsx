// src/pages/Communication.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import CodeTile from '../components/Common/CodeTile';

const Communication: React.FC = () => {
  return (
    <div className="page communication-page">
      <div className="page-header">
        <h1>Communication & Networking</h1>
        <p className="page-description">
          Advanced BeeAdHoc mesh networking with RSSI-based neighbor selection, 
          MAC registry security, and adaptive sleep modes
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="BeeAdHoc Protocol"
            description="Bio-inspired mesh networking with scout/forager roles and localized communication chains"
            icon="🐝"
            color="#2dd4bf"
            size="medium"
          >
            <div className="protocol-stats">
              <div className="stat">70-90% Network Load Reduction</div>
              <div className="stat">50%+ Power Savings</div>
              <div className="stat">&lt;100ms Latency</div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Security & Authentication"
            description="MAC registry with SHA-1 hashing and timestamp-based intruder detection"
            icon="🔒"
            color="#60a5fa"
            size="medium"
          >
            <div className="security-features">
              <div className="feature">Dynamic MAC Registry</div>
              <div className="feature">SHA-1 Hash Verification</div>
              <div className="feature">&lt;10ms Computation Time</div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <CodeTile
            title="Data Packet Structure"
            description="Optimized packet structure for swarm communication"
            language="cpp"
            size="wide"
          >
{`struct DataPacket {
  uint8_t type;       // 0: Obstacle, 1: Command, 2: Status
  uint8_t roverId;    // Unique rover identifier
  uint8_t mac[6];     // Sender MAC for security
  float position[3];  // x, y, z coordinates
  float orientation[3]; // roll, pitch, yaw
  uint8_t payload[16]; // Obstacle data or command
  uint32_t hash;      // SHA-1 hash for integrity
};

// Packet Types:
// - OBSTACLE: Distance readings, obstacle coordinates
// - COMMAND: Motor instructions, mode changes
// - STATUS: Battery level, sensor health, role assignment`}
          </CodeTile>
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Communication Flow</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Neighbor Discovery</h4>
                  <p>Rovers broadcast "hello" packets with MAC addresses, RSSI-based neighbor selection</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Role Assignment</h4>
                  <p>Strong signal rovers become scouts, others become foragers with sleep modes</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Data Relay</h4>
                  <p>Scouts detect obstacles, foragers relay data via nearest-neighbor chains</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Security Verification</h4>
                  <p>SHA-1(MAC + Timestamp) verification on packet reception</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
