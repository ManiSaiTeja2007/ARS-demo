// src/pages/Sensors.tsx
import React from 'react';
import FeatureCard from '../components/Common/FeatureCard';
import SpecificationTile from '../components/Common/SpecificationTile';

const Sensors: React.FC = () => {
  return (
    <div className="page sensors-page">
      <div className="page-header">
        <h1>Sensors & Data Processing</h1>
        <p className="page-description">
          Advanced sensor fusion with Kalman filtering, error estimation, 
          and real-time 3D mapping capabilities
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <SpecificationTile
            title="HC-SR04 Ultrasonic Sensor"
            specifications={[
              "Range: 2-400 cm",
              "Accuracy: 3 mm",
              "Temperature Compensation: ±1-2% per °C",
              "Beam Angle: 15°",
              "Update Rate: 10 Hz"
            ]}
            status="operational"
            size="medium"
          />

          <SpecificationTile
            title="MPU6050 IMU"
            specifications={[
              "Accelerometer: ±2g to ±16g",
              "Gyroscope: ±250 to ±2000°/s",
              "Gyro Bias: 0.05°/s",
              "Temperature Sensor: -40 to 85°C",
              "I2C Interface"
            ]}
            status="operational"
            size="medium"
          />
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Sensor Fusion & Kalman Filtering"
            description="Multi-sensor data fusion with 60-75% noise reduction and predictive modeling"
            icon="📊"
            color="#f59e0b"
            size="wide"
          >
            <div className="fusion-stats">
              <div className="stat-item">
                <span>Noise Reduction:</span>
                <span>60-75%</span>
              </div>
              <div className="stat-item">
                <span>Update Rate:</span>
                <span>100 Hz</span>
              </div>
              <div className="stat-item">
                <span>Position Accuracy:</span>
                <span>±3 cm</span>
              </div>
              <div className="stat-item">
                <span>Orientation Accuracy:</span>
                <span>±1°</span>
              </div>
            </div>
          </FeatureCard>
        </div>

        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Error Estimation & Compensation</h3>
            <div className="error-models">
              <div className="error-model">
                <h4>Theoretical Model</h4>
                <ul>
                  <li>Perfect sensor readings</li>
                  <li>No environmental factors</li>
                  <li>Ideal grid-based mapping</li>
                  <li>Zero slip conditions</li>
                </ul>
              </div>
              <div className="error-model">
                <h4>Practical Model</h4>
                <ul>
                  <li>3-10% wheel slip error</li>
                  <li>±1-2% ultrasonic error per °C</li>
                  <li>0.05°/s gyro bias</li>
                  <li>Environmental interference</li>
                </ul>
              </div>
              <div className="error-model">
                <h4>Compensation Methods</h4>
                <ul>
                  <li>Kalman filtering (60-75% noise reduction)</li>
                  <li>IGG III robust estimation</li>
                  <li>Temperature compensation</li>
                  <li>Sensor calibration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sensors;
