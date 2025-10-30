// src/pages/Validation.tsx
import React from 'react';
import ValidationPipeline from '../components/UI/ValidationPipeline';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Validation: React.FC = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Ingress Validation Pipeline</h1>
        <p className="page-description">
          Strict ordered processing for all inbound JSON messages with security checks and priority handling
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <div className="tile size-wide">
            <ValidationPipeline />
          </div>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Time-Window Check"
            description="Strict timing validation with priority exceptions"
            icon="⏰"
            color="#2dd4bf"
            size="medium"
          >
            <div className="timing-specs">
              <div className="timing-item">
                <h4>Normal Messages</h4>
                <p>±0.2 seconds tolerance</p>
                <code>cycle_id + ts_cycle → wall time</code>
              </div>
              <div className="timing-item">
                <h4>High-Priority Messages</h4>
                <p>±1.0 seconds extended tolerance</p>
                <ul>
                  <li>Intruder alerts</li>
                  <li>Master commands</li>
                  <li>Forager recovery</li>
                </ul>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Proximity Gating (5.0m)"
            description="Compute nearest distance from raw sweeps to prevent tampering"
            icon="📏"
            color="#60a5fa"
            size="medium"
          >
            <div className="proximity-info">
              <p><strong>Security Feature:</strong> Prevents rovers from claiming nearby obstacles to force backend computation</p>
              <div className="proximity-rule">
                <span className="rule-icon">✅</span>
                <span>Min distance ≤ 5.0m → Proceed with geometry</span>
              </div>
              <div className="proximity-rule">
                <span className="rule-icon">⏩</span>
                <span>Min distance &gt; 5.0m → Skip heavy processing</span>
              </div>
              <div className="code-snippet">
                <code>min_distance = Math.min(...sweep) / 100.0</code>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Priority Stream Handling"
            description="Dedicated Redis streams and worker pools for critical messages"
            icon="🚀"
            color="#f59e0b"
            size="wide"
          >
            <div className="priority-system">
              <div className="priority-tier">
                <h4>Priority Stream</h4>
                <p><code>telemetry:priority</code></p>
                <ul>
                  <li>TTL: 60 seconds</li>
                  <li>Dedicated worker pool</li>
                  <li>Higher resource allocation</li>
                  <li>Immediate processing</li>
                </ul>
              </div>
              <div className="priority-tier">
                <h4>Normal Stream</h4>
                <p><code>telemetry:raw</code></p>
                <ul>
                  <li>TTL: 30 seconds</li>
                  <li>Standard worker pool</li>
                  <li>Normal processing queue</li>
                </ul>
              </div>
              <div className="priority-types">
                <h4>High-Priority Message Types:</h4>
                <ol>
                  <li>Intruder security alerts</li>
                  <li>Master direct commands</li>
                  <li>Forager recovery messages</li>
                  <li>Session/manual control commands</li>
                </ol>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="8 steps"
            label="Validation Pipeline"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="5.0 m"
            label="Proximity Gate"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="60s"
            label="Priority TTL"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="30s"
            label="Normal TTL"
            suffix=""
            size="small"
            color="#10b981"
          />
        </div>
      </div>
    </div>
  );
};

export default Validation;