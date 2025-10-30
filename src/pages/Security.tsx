// src/pages/Security.tsx
import React from 'react';
import SecurityViz from '../components/UI/SecurityViz';
import CodeTile from '../components/Common/CodeTile';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Security: React.FC = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Security & Cryptography</h1>
        <p className="page-description">
          Layered security with rotating keys, HMAC-SHA256 hashes, and provisional registration
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <div className="tile size-wide">
            <SecurityViz />
          </div>
        </div>

        <div className="tile-row">
          <CodeTile
            title="Hash Formula (HMAC-SHA256)"
            description="First 4 bytes of hex digest, uppercase, no separators"
            language="typescript"
            size="medium"
          >
{`// HMAC-SHA256 Hash Computation
hmac_full = HMAC_SHA256(
  hash_key, 
  hash_compute || hash_seq || ts_cycle
);
hash = first_4_bytes_of(hex_digest(hmac_full))
       .toUpperCase();  // e.g., "A1B2C3D4"

// Example implementation:
function computeHash(
  hash_key: string,
  hash_compute: string,
  hash_seq: number,
  ts_cycle: number
): string {
  const data = hash_compute + hash_seq + ts_cycle;
  const hmac = crypto.createHmac('sha256', hash_key);
  hmac.update(data);
  const fullHash = hmac.digest('hex');
  return fullHash.substring(0, 8).toUpperCase();
}`}
          </CodeTile>

          <FeatureCard
            title="Key Lifecycles"
            description="Rotating keys with different timeframes for security"
            icon="🔑"
            color="#2dd4bf"
            size="medium"
          >
            <div className="key-lifecycles">
              <div className="key-item">
                <h4>hash_key</h4>
                <p>Rotated every 15-minute cycle</p>
                <span className="key-duration">15 min</span>
              </div>
              <div className="key-item">
                <h4>hash_compute</h4>
                <p>Issued every 6 heartbeats (≈60s)</p>
                <span className="key-duration">60 sec</span>
              </div>
              <div className="key-item">
                <h4>hash_seq</h4>
                <p>Per-message sequence integer</p>
                <span className="key-duration">Per message</span>
              </div>
              <div className="key-item">
                <h4>Provisional Key</h4>
                <p>One-time use, 60s timeout</p>
                <span className="key-duration">60 sec</span>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Provisional Registration Proof"
            description="One-time registration for new MACs with timeout protection"
            icon="🆕"
            color="#60a5fa"
            size="medium"
          >
            <div className="registration-flow">
              <div className="flow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>New MAC Detected</h4>
                  <p>Unknown MAC attempts communication</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Provisional Key Required</h4>
                  <p>Backend issues one-time provisional key</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Registration Proof</h4>
                  <p>Rover provides hash_compute=0 proof</p>
                </div>
              </div>
              <div className="flow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Key Replacement</h4>
                  <p>Provisional key replaced with normal hash_key</p>
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Intrusion Response"
            description="Immediate actions on hash mismatch detection"
            icon="🚨"
            color="#ef4444"
            size="medium"
          >
            <div className="intrusion-response">
              <div className="response-step">
                <span className="step-icon">📝</span>
                <div>
                  <h4>Log Security Event</h4>
                  <p>Audit log entry created</p>
                </div>
              </div>
              <div className="response-step">
                <span className="step-icon">🔄</span>
                <div>
                  <h4>Immediate Key Rotation</h4>
                  <p>Unit's hash_key rotated server-side</p>
                </div>
              </div>
              <div className="response-step">
                <span className="step-icon">📢</span>
                <div>
                  <h4>Broadcast Challenge</h4>
                  <p>Verification message via mesh</p>
                </div>
              </div>
              <div className="response-step">
                <span className="step-icon">⏱️</span>
                <div>
                  <h4>Re-registration Required</h4>
                  <p>Within next heartbeat cycle (~10s)</p>
                </div>
              </div>
              <div className="response-step">
                <span className="step-icon">🚫</span>
                <div>
                  <h4>Isolation</h4>
                  <p>Failure to re-register → isolate unit</p>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="4 bytes"
            label="Hash Length"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="60s"
            label="Provisional Timeout"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="15 min"
            label="Key Rotation"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="10s"
            label="Re-registration Window"
            suffix=""
            size="small"
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  );
};

export default Security;