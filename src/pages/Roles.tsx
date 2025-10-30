// src/pages/Roles.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Roles: React.FC = () => {
  const priorities = [
    { level: 1, type: 'Intruder security alert', description: 'Highest priority immediate action' },
    { level: 2, type: 'Master direct command', description: 'Backend control commands' },
    { level: 3, type: 'Forager recovery messages', description: 'Towing and recovery operations' },
    { level: 4, type: 'Session commands', description: 'Manual control session traffic' },
    { level: 5, type: 'Heartbeat / Self-location', description: 'Status and positioning updates' },
    { level: 6, type: 'Scout sweeps', description: 'Normal mapping telemetry' },
    { level: 7, type: 'Sleep periodic scans', description: 'Low-power mode data' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Roles & Traffic Priorities</h1>
        <p className="page-description">
          Dynamic role assignment with strict priority ordering for network traffic and processing
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="Scout Role"
            description="Active scanning and mapping with frequent sensor sweeps"
            icon="🔍"
            color="#2dd4bf"
            size="medium"
          >
            <div className="role-details">
              <div className="responsibility">
                <h4>Primary Responsibilities</h4>
                <ul>
                  <li>Ultrasonic scanning ±15°, 30 samples</li>
                  <li>Local occupancy bitmap maintenance (~100 positions)</li>
                  <li>Frequent telemetry transmission</li>
                  <li>Obstacle detection and mapping</li>
                </ul>
              </div>
              <div className="specifications">
                <h4>Specifications</h4>
                <ul>
                  <li>Memory: &lt;5KB bitmap storage</li>
                  <li>Power: Medium consumption</li>
                  <li>Network: Regular telemetry</li>
                  <li>Processing: Local obstacle detection</li>
                </ul>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Forager Role"
            description="Recovery and towing operations with elevated network priority"
            icon="🚜"
            color="#f59e0b"
            size="medium"
          >
            <div className="role-details">
              <div className="responsibility">
                <h4>Primary Responsibilities</h4>
                <ul>
                  <li>Object recovery and transport</li>
                  <li>Towing operations</li>
                  <li>Emergency response</li>
                  <li>Priority communication</li>
                </ul>
              </div>
              <div className="privileges">
                <h4>Special Privileges</h4>
                <ul>
                  <li>Higher network priority (#3)</li>
                  <li>Can ignore boundary rules during recovery</li>
                  <li>Extended communication range</li>
                  <li>Priority resource allocation</li>
                </ul>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Sleep Role"
            description="Power-conserving mode with minimal activity"
            icon="💤"
            color="#60a5fa"
            size="medium"
          >
            <div className="role-details">
              <div className="responsibility">
                <h4>Primary Responsibilities</h4>
                <ul>
                  <li>Power conservation</li>
                  <li>Occasional heartbeat transmission</li>
                  <li>Minimal environmental scanning</li>
                  <li>Quick wake-on-demand</li>
                </ul>
              </div>
              <div className="power-specs">
                <h4>Power Management</h4>
                <ul>
                  <li>Aggressive sleep cycles</li>
                  <li>Minimal sensor usage</li>
                  <li>Reduced communication frequency</li>
                  <li>Rapid state transitions</li>
                </ul>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h2>Traffic Priority Ordering</h2>
            <div className="priority-table">
              {priorities.map(priority => (
                <div key={priority.level} className="priority-item">
                  <div className="priority-level">
                    <span className="level-number">{priority.level}</span>
                  </div>
                  <div className="priority-type">
                    <h4>{priority.type}</h4>
                    <p>{priority.description}</p>
                  </div>
                  <div className="priority-handling">
                    {priority.level <= 4 ? (
                      <span className="priority-high">High Priority Stream</span>
                    ) : (
                      <span className="priority-normal">Normal Stream</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Manual Session Handling"
            description="Dedicated low-latency communication for real-time control"
            icon="🎮"
            color="#8b5cf6"
            size="wide"
          >
            <div className="session-details">
              <div className="session-feature">
                <h4>Separate UDP Port</h4>
                <p>Mandatory dedicated port for session traffic with main port fallback</p>
              </div>
              <div className="session-feature">
                <h4>Traffic Suppression</h4>
                <p>Non-session traffic suppressed along control path for reduced latency</p>
              </div>
              <div className="session-feature">
                <h4>Fallback Mechanism</h4>
                <p>If session port blocked, degrades to main port with logged warning</p>
              </div>
              <div className="session-feature">
                <h4>Priority Level</h4>
                <p>Position 3.5 - above heartbeats, below forager recovery</p>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="3"
            label="Primary Roles"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="7"
            label="Priority Levels"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="&lt;5KB"
            label="Scout Memory"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="2"
            label="UDP Ports"
            suffix=""
            size="small"
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  );
};

export default Roles;