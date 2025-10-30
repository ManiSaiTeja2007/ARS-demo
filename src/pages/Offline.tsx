// src/pages/Offline.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Offline: React.FC = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Offline Caching & Sleep Mechanics</h1>
        <p className="page-description">
          Robust operation during network outages with intelligent caching and rendezvous protocols
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="Offline Cache Management"
            description="Priority-based caching with configurable retention policies"
            icon="💾"
            color="#2dd4bf"
            size="medium"
          >
            <div className="cache-specs">
              <div className="cache-item">
                <h4>Cache Duration</h4>
                <p>Up to 3 cycles = 45 minutes</p>
              </div>
              <div className="cache-item">
                <h4>Memory Threshold</h4>
                <p>Prune when free memory &lt; 90%</p>
              </div>
              <div className="cache-item">
                <h4>Prune Priority Order</h4>
                <ol>
                  <li>Sleep scans (lowest priority)</li>
                  <li>Scout sweeps</li>
                  <li>Noncritical telemetry</li>
                  <li>Heartbeat/status (highest priority)</li>
                </ol>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Rendezvous & ACK Gathering"
            description="Mesh-wide coordination before sleep with duplicate prevention"
            icon="📍"
            color="#60a5fa"
            size="medium"
          >
            <div className="rendezvous-protocol">
              <div className="protocol-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Converge to Rendezvous</h4>
                  <p>Move to preconfigured location or last leader position</p>
                </div>
              </div>
              <div className="protocol-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Broadcast Ping</h4>
                  <p>ESP-NOW mesh-wide broadcast with 5s timeout</p>
                </div>
              </div>
              <div className="protocol-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>ACK Counting</h4>
                  <p>Count unique responders, prevent echo double-counting</p>
                </div>
              </div>
              <div className="protocol-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>MAC List Storage</h4>
                  <p>Save responder MAC list locally for verification</p>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Wake & Verification Process"
            description="Integrity checks and roster validation when returning online"
            icon="🔍"
            color="#f59e0b"
            size="wide"
          >
            <div className="verification-process">
              <div className="verification-step">
                <h4>Backend Connection Restored</h4>
                <p>Rover re-establishes connection to backend server</p>
              </div>
              <div className="verification-step">
                <h4>MAC List Comparison</h4>
                <p>Compare saved MAC list against backend roster</p>
                <div className="comparison-details">
                  <div className="match">
                    <span className="status-icon">✅</span>
                    <span>Count and identity match → Normal operation</span>
                  </div>
                  <div className="mismatch">
                    <span className="status-icon">⚠️</span>
                    <span>Count mismatch → Investigate missing units</span>
                  </div>
                  <div className="intruder">
                    <span className="status-icon">🚨</span>
                    <span>Unknown MACs detected → Security protocol</span>
                  </div>
                </div>
              </div>
              <div className="verification-step">
                <h4>Cache Upload & Sync</h4>
                <p>Transmit cached telemetry with timestamps</p>
              </div>
              <div className="verification-step">
                <h4>Role Reassignment</h4>
                <p>Dynamic role assignment based on current network state</p>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="45 min"
            label="Max Cache Duration"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="90%"
            label="Prune Threshold"
            suffix=" free memory"
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="5s"
            label="ACK Timeout"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="4"
            label="Prune Priority Levels"
            suffix=""
            size="small"
            color="#10b981"
          />
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Offline Security Considerations</h3>
            <div className="security-considerations">
              <div className="consideration">
                <h4>Data Integrity</h4>
                <p>Cached telemetry maintains hash verification for integrity checking upon upload</p>
              </div>
              <div className="consideration">
                <h4>Rendezvous Authentication</h4>
                <p>Rendezvous locations verified through pre-shared configuration</p>
              </div>
              <div className="consideration">
                <h4>Mesh Communication Security</h4>
                <p>ESP-NOW broadcasts use current cycle keys for authentication</p>
              </div>
              <div className="consideration">
                <h4>Intrusion Detection</h4>
                <p>MAC list comparison detects unauthorized nodes that joined during offline period</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;