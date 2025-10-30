// src/pages/Fusion.tsx
import React from 'react';
import FusionEKF from '../components/UI/FusionEKF';
import FeatureCard from '../components/Common/FeatureCard';
import StatCard from '../components/Common/StatCard';

const Fusion: React.FC = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Global EKF Fusion</h1>
        <p className="page-description">
          Single global Extended Kalman Filter for all rover tracks with cross-corrections and real-time pose estimation
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <div className="tile size-wide">
            <FusionEKF />
          </div>
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Sensor Fusion Inputs"
            description="Multiple data sources combined for accurate pose estimation"
            icon="📡"
            color="#2dd4bf"
            size="medium"
          >
            <div className="sensor-inputs">
              <div className="input-source">
                <h4>IMU (MPU6050)</h4>
                <ul>
                  <li>Accelerometer: ±16g</li>
                  <li>Gyroscope: ±2000°/s</li>
                  <li>Orientation data</li>
                </ul>
              </div>
              <div className="input-source">
                <h4>Dead Reckoning</h4>
                <ul>
                  <li>Wheel encoders</li>
                  <li>Velocity integration</li>
                  <li>Heading changes</li>
                </ul>
              </div>
              <div className="input-source">
                <h4>Sweep Observations</h4>
                <ul>
                  <li>Ultrasonic distances</li>
                  <li>Relative bearings</li>
                  <li>Obstacle positions</li>
                </ul>
              </div>
              <div className="input-source">
                <h4>RSSI Metadata</h4>
                <ul>
                  <li>Signal strength</li>
                  <li>Relative bearings</li>
                  <li>Neighbor positions</li>
                </ul>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Cross-Correction Benefits"
            description="Global filter enables collaborative positioning and map alignment"
            icon="🔄"
            color="#60a5fa"
            size="medium"
          >
            <div className="cross-correction-benefits">
              <div className="benefit">
                <span className="benefit-icon">🎯</span>
                <div>
                  <h4>Global Map Alignment</h4>
                  <p>All rovers contribute to unified coordinate system</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📈</span>
                <div>
                  <h4>Improved Accuracy</h4>
                  <p>Relative observations reduce cumulative errors</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⚡</span>
                <div>
                  <h4>Fault Tolerance</h4>
                  <p>Rovers can localize using neighbor data</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔄</span>
                <div>
                  <h4>Real-time Updates</h4>
                  <p>Continuous position refinement</p>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <StatCard
            value="&lt;50 ms"
            label="Fast Path Target"
            suffix=""
            size="small"
            color="#2dd4bf"
          />
          <StatCard
            value="Global"
            label="Filter Scope"
            suffix=""
            size="small"
            color="#60a5fa"
          />
          <StatCard
            value="4+"
            label="Input Sources"
            suffix=""
            size="small"
            color="#f59e0b"
          />
          <StatCard
            value="Real-time"
            label="Update Rate"
            suffix=""
            size="small"
            color="#10b981"
          />
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>EKF State Vector Components</h3>
            <div className="state-vector">
              <div className="state-component">
                <h4>Position States</h4>
                <ul>
                  <li><code>x, y</code> - 2D coordinates</li>
                  <li><code>heading</code> - Orientation</li>
                  <li><code>velocity_x, velocity_y</code> - Linear velocities</li>
                  <li><code>angular_velocity</code> - Rotation rate</li>
                </ul>
              </div>
              <div className="state-component">
                <h4>Sensor Bias States</h4>
                <ul>
                  <li><code>accel_bias_x, accel_bias_y</code> - Accelerometer biases</li>
                  <li><code>gyro_bias</code> - Gyroscope bias</li>
                  <li><code>wheel_bias_left, wheel_bias_right</code> - Wheel calibration</li>
                </ul>
              </div>
              <div className="state-component">
                <h4>Covariance Matrix</h4>
                <ul>
                  <li>Uncertainty estimation</li>
                  <li>Cross-correlation terms</li>
                  <li>Adaptive noise modeling</li>
                  <li>Confidence intervals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fusion;