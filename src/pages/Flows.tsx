import React from 'react';
import FlowDiagram from '../components/Common/FlowDiagram';
import FeatureCard from '../components/Common/FeatureCard';
import type { FlowStep } from '../types';

const Flows: React.FC = () => {
  const telemetrySteps: FlowStep[] = [
    { id: '1', label: 'Rover Sweep', description: 'Perform ultrasonic sweep ±15°, 30 samples in cm', actor: 'Rover' },
    { id: '2', label: 'Pack Frame', description: 'Create compact ESP-NOW binary frame', actor: 'Rover' },
    { id: '3', label: 'ESP-NOW Send', description: 'Transmit via mesh to leader', actor: 'Rover' },
    { id: '4', label: 'Leader Receive', description: 'Receive and unpack compact frame', actor: 'Leader' },
    { id: '5', label: 'JSON Conversion', description: 'Convert to canonical JSON with hash HEX', actor: 'Leader' },
    { id: '6', label: 'UDP Forward', description: 'Send JSON to backend port 9999', actor: 'Leader' },
    { id: '7', label: 'Backend Validation', description: 'Time, MAC, Hash, Dedupe, Proximity checks', actor: 'Backend' },
    { id: '8', label: 'Redis Stream', description: 'Append to telemetry:raw stream', actor: 'Backend' },
    { id: '9', label: 'Fusion Update', description: 'Global EKF pose estimation', actor: 'Backend' },
    { id: '10', label: 'Geometry Processing', description: 'Alpha-shape with 500-point cap', actor: 'Backend' },
    { id: '11', label: 'WebSocket Push', description: 'Real-time updates to UI', actor: 'Backend' }
  ];

  const intruderSteps: FlowStep[] = [
    { id: '1', label: 'Hash Mismatch', description: 'Backend detects invalid hash', actor: 'Backend' },
    { id: '2', label: 'Security Log', description: 'Create audit event', actor: 'Backend' },
    { id: '3', label: 'Key Rotation', description: 'Immediately rotate unit hash_key', actor: 'Backend' },
    { id: '4', label: 'Challenge Broadcast', description: 'Send verification via mesh', actor: 'Backend' },
    { id: '5', label: 'Re-registration', description: 'Rover must re-register within 10s', actor: 'Rover' },
    { id: '6', label: 'Isolation', description: 'Failure to re-register → isolate', actor: 'Backend' }
  ];

  const sessionSteps: FlowStep[] = [
    { id: '1', label: 'UI Session Request', description: 'Operator initiates manual control', actor: 'UI' },
    { id: '2', label: 'Session Negotiation', description: 'Backend creates ephemeral session ID', actor: 'Backend' },
    { id: '3', label: 'Port Opening', description: 'Open separate UDP session port', actor: 'Backend' },
    { id: '4', label: 'Command Encryption', description: 'Encrypt with hash_compute included', actor: 'Backend' },
    { id: '5', label: 'Traffic Suppression', description: 'Nodes suppress non-session traffic', actor: 'Leader' },
    { id: '6', label: 'Fallback Handling', description: 'If blocked, use main port with warning', actor: 'Backend' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>End-to-End System Flows</h1>
        <p className="page-description">
          Detailed sequence diagrams showing critical system workflows and message exchanges
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <div className="tile size-wide">
            <h2>Telemetry Sweep Flow (Normal Operation)</h2>
            <FlowDiagram steps={telemetrySteps} title="Normal Telemetry Path" />
            
            <div className="flow-details">
              <FeatureCard
                title="Key Validation Steps"
                description="Backend ingress pipeline for telemetry messages"
                size="medium"
              >
                <ol className="validation-steps">
                  <li>
                    <strong>Time-window check</strong>
                    <span>±0.2s normal, ±1.0s priority</span>
                  </li>
                  <li>
                    <strong>MAC lookup & registration</strong>
                    <span>Provisional key for new MACs</span>
                  </li>
                  <li>
                    <strong>Hash verification</strong>
                    <span>HMAC-SHA256 first 4 bytes</span>
                  </li>
                  <li>
                    <strong>Duplicate detection</strong>
                    <span>Redis (mac, hash_seq) check</span>
                  </li>
                  <li>
                    <strong>Proximity gating</strong>
                    <span>5.0m from raw sweeps</span>
                  </li>
                </ol>
              </FeatureCard>
            </div>
          </div>
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h2>Intruder / Security Mismatch Flow</h2>
            <FlowDiagram steps={intruderSteps} title="Security Incident Response" />
            
            <div className="security-actions">
              <FeatureCard
                title="Immediate Response Actions"
                description="Automated security measures on hash mismatch"
                color="#ef4444"
                size="medium"
              >
                <div className="response-actions">
                  <div className="action-item">
                    <span className="action-icon">📝</span>
                    <div>
                      <h4>Log Security Event</h4>
                      <p>Detailed audit trail with timestamps</p>
                    </div>
                  </div>
                  <div className="action-item">
                    <span className="action-icon">🔄</span>
                    <div>
                      <h4>Immediate Key Rotation</h4>
                      <p>Prevent further unauthorized access</p>
                    </div>
                  </div>
                  <div className="action-item">
                    <span className="action-icon">🎯</span>
                    <div>
                      <h4>Targeted Challenge</h4>
                      <p>Verify rover identity and integrity</p>
                    </div>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard
                title="Isolation Criteria"
                description="Conditions leading to rover isolation"
                color="#f59e0b"
                size="medium"
              >
                <ul className="isolation-criteria">
                  <li>Failure to respond to challenge within 10s</li>
                  <li>Multiple consecutive hash mismatches</li>
                  <li>Invalid provisional key usage</li>
                  <li>Suspicious message patterns</li>
                </ul>
              </FeatureCard>
            </div>
          </div>
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h2>Manual Control Session Flow</h2>
            <FlowDiagram steps={sessionSteps} title="Low-Latency Manual Control" />
            
            <div className="session-features">
              <FeatureCard
                title="Session Port Benefits"
                description="Dedicated communication channel for real-time control"
                color="#2dd4bf"
                size="medium"
              >
                <div className="benefits-list">
                  <div className="benefit">
                    <h4>Low Latency</h4>
                    <p>Dedicated port avoids queue delays</p>
                  </div>
                  <div className="benefit">
                    <h4>Traffic Prioritization</h4>
                    <p>Non-session traffic suppressed along path</p>
                  </div>
                  <div className="benefit">
                    <h4>Fallback Resilience</h4>
                    <p>Automatic degradation to main port</p>
                  </div>
                  <div className="benefit">
                    <h4>Resource Isolation</h4>
                    <p>Dedicated processing for control commands</p>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard
                title="Encryption & Security"
                description="Secure command transmission even in manual mode"
                color="#60a5fa"
                size="medium"
              >
                <div className="security-measures">
                  <div className="measure">
                    <strong>Command Format:</strong>
                    <code>&lt;ENC&gt;[PRIO]|CMD|TARGET_MAC|SEQ|HASH_COMPUTE|CHECKSUM&lt;/ENC&gt;</code>
                  </div>
                  <div className="measure">
                    <strong>Encryption:</strong>
                    <span>Symmetric with rover's hash_key</span>
                  </div>
                  <div className="measure">
                    <strong>Validation:</strong>
                    <span>SEQ, HASH_COMPUTE, CHECKSUM verification</span>
                  </div>
                </div>
              </FeatureCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flows;