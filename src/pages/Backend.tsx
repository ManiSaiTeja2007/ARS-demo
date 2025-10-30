// src/pages/Backend.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';
import CodeTile from '../components/Common/CodeTile';

const Backend: React.FC = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Backend Architecture</h1>
        <p className="page-description">
          Python server with UDP ingestion, Redis streams, PostGIS persistence, and dedicated worker pools
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <FeatureCard
            title="Network & Port Configuration"
            description="Multiple UDP ports for different traffic types with fallback mechanisms"
            icon="🌐"
            color="#2dd4bf"
            size="medium"
          >
            <div className="port-configuration">
              <div className="port-item">
                <h4>Main JSON Port</h4>
                <p><code>9999</code> - Canonical JSON ingestion</p>
                <span className="port-type">Primary UDP</span>
              </div>
              <div className="port-item">
                <h4>Session Port</h4>
                <p><code>10000</code> - Manual control sessions</p>
                <span className="port-type">Mandatory separate</span>
              </div>
              <div className="port-item">
                <h4>Simulator Port</h4>
                <p><code>10001</code> - Simulation traffic</p>
                <span className="port-type">Separate default</span>
              </div>
              <div className="port-note">
                <p><strong>Fallback:</strong> Session port blocked → main port with warning</p>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Redis Stream Architecture"
            description="Decoupled processing with priority queues and dedicated workers"
            icon="📊"
            color="#60a5fa"
            size="medium"
          >
            <div className="redis-streams">
              <div className="stream">
                <h4>telemetry:priority</h4>
                <ul>
                  <li>High-priority messages</li>
                  <li>TTL: 60 seconds</li>
                  <li>Dedicated worker pool</li>
                  <li>Immediate processing</li>
                </ul>
              </div>
              <div className="stream">
                <h4>telemetry:raw</h4>
                <ul>
                  <li>Normal telemetry</li>
                  <li>TTL: 30 seconds</li>
                  <li>Standard worker pool</li>
                  <li>Queued processing</li>
                </ul>
              </div>
              <div className="stream">
                <h4>Dedupe Store</h4>
                <ul>
                  <li>Redis set/Bloom filter</li>
                  <li><code>(mac, hash_seq)</code> keys</li>
                  <li>Duplicate prevention</li>
                </ul>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Worker Pool Allocation"
            description="Specialized worker pools for different processing tasks"
            icon="👷"
            color="#f59e0b"
            size="wide"
          >
            <div className="worker-pools">
              <div className="worker-pool priority">
                <h4>Priority Worker Pool</h4>
                <div className="pool-specs">
                  <span className="spec">Dedicated threads/processes</span>
                  <span className="spec">Higher resource allocation</span>
                  <span className="spec">Immediate consumption</span>
                  <span className="spec">Critical path optimization</span>
                </div>
              </div>
              <div className="worker-pool normal">
                <h4>Normal Worker Pool</h4>
                <div className="pool-specs">
                  <span className="spec">Standard resources</span>
                  <span className="spec"><code>telemetry:raw</code> consumption</span>
                  <span className="spec">Geometry processing</span>
                </div>
              </div>
              <div className="worker-pool fusion">
                <h4>Fusion Worker</h4>
                <div className="pool-specs">
                  <span className="spec">Global EKF updates</span>
                  <span className="spec">Real-time pose estimation</span>
                  <span className="spec">Cross-rover corrections</span>
                </div>
              </div>
              <div className="worker-pool geometry">
                <h4>Geometry Workers</h4>
                <div className="pool-specs">
                  <span className="spec">Multiprocessing pool</span>
                  <span className="spec">NumPy + Shapely (GEOS)</span>
                  <span className="spec">Alpha-shape computation</span>
                  <span className="spec">Capped parallelism</span>
                </div>
              </div>
              <div className="worker-pool alert">
                <h4>Alert/Health Worker</h4>
                <div className="pool-specs">
                  <span className="spec">Heartbeat monitoring</span>
                  <span className="spec">Forager assignments</span>
                  <span className="spec">Security actions</span>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <CodeTile
            title="PostGIS Database Schema"
            description="Spatial database design for rover tracking and obstacle management"
            language="sql"
            size="medium"
          >
{`-- Rovers table with spatial capabilities
CREATE TABLE rovers (
  mac VARCHAR(17) PRIMARY KEY,
  alias VARCHAR(50),
  hash_key BYTEA,
  role VARCHAR(10) CHECK (role IN ('scout','forager','sleep')),
  last_seen TIMESTAMP,
  last_ip INET,
  rank INTEGER,
  is_leader BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  current_position GEOGRAPHY(POINT)
);

-- Telemetry history with full JSON storage
CREATE TABLE telemetry_history (
  id BIGSERIAL PRIMARY KEY,
  mac VARCHAR(17) REFERENCES rovers(mac),
  cycle_id INTEGER,
  ts_cycle INTEGER,
  raw_json JSONB,
  received_at TIMESTAMP DEFAULT NOW()
);

-- Obstacles with polygon geometry
CREATE TABLE obstacles (
  id BIGSERIAL PRIMARY KEY,
  geom GEOGRAPHY(POLYGON),
  provenance JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP,
  confidence FLOAT
);

-- Security and system events
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(50),
  macs JSONB,
  details JSONB,
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);`}
          </CodeTile>

          <FeatureCard
            title="Monitoring & Administration"
            description="Comprehensive monitoring with Prometheus/Grafana and admin controls"
            icon="📈"
            color="#10b981"
            size="medium"
          >
            <div className="monitoring-features">
              <div className="monitoring-item">
                <h4>Metrics Collection</h4>
                <ul>
                  <li>Ingest rate and latency</li>
                  <li>Redis queue depths</li>
                  <li>PostGIS write performance</li>
                  <li>Hash mismatch counts</li>
                </ul>
              </div>
              <div className="monitoring-item">
                <h4>Admin Endpoints</h4>
                <ul>
                  <li>Prune priority configuration</li>
                  <li>Alpha tuning parameters</li>
                  <li>Provisional key timeout</li>
                  <li>Cycle settings management</li>
                  <li>Hard reset capabilities</li>
                </ul>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="Python"
            label="Backend Language"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="3"
            label="UDP Ports"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="5"
            label="Worker Pools"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="PostGIS"
            label="Database"
            suffix=""
            size="small"
            color="#10b981"
          />
        </div>
      </div>
    </div>
  );
};

export default Backend;