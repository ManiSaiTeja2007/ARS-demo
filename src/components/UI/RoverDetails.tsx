// src/components/UI/RoverDetails.tsx
import React from 'react';
import type { Rover, SimulationState } from '../../types';

interface RoverDetailsProps {
  rover: Rover;
  simulationState?: SimulationState; // Make it optional since it's not used
}

const RoverDetails: React.FC<RoverDetailsProps> = ({ rover }) => { // Removed simulationState
  return (
    <div className="rover-details">
      <div className="details-header">
        <h3>Rover {rover.id} Details</h3>
        <div className="rover-status" data-status={rover.status}>
          {rover.status.toUpperCase()}
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <label>Position</label>
          <span>X: {rover.position.x.toFixed(1)}</span>
          <span>Y: {rover.position.y.toFixed(1)}</span>
          <span>Z: {rover.position.z.toFixed(1)}</span>
        </div>

        <div className="detail-item">
          <label>Orientation</label>
          <span>Yaw: {(rover.rotation.y * 180 / Math.PI).toFixed(1)}°</span>
        </div>

        <div className="detail-item">
          <label>Velocity</label>
          <span>{rover.velocity.z.toFixed(2)} m/s</span>
        </div>

        <div className="detail-item">
          <label>Battery</label>
          <div className="battery-bar">
            <div 
              className="battery-level" 
              style={{ width: `${rover.battery}%` }}
              data-level={rover.battery > 30 ? 'high' : rover.battery > 15 ? 'medium' : 'low'}
            ></div>
          </div>
          <span>{rover.battery.toFixed(0)}%</span>
        </div>

        <div className="detail-item">
          <label>Role</label>
          <span className={`role-badge role-${rover.role}`}>
            {rover.role.toUpperCase()}
          </span>
        </div>

        <div className="detail-item">
          <label>Mode</label>
          <span className={`mode-badge mode-${rover.mode}`}>
            {rover.mode.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="sensor-readings">
        <h4>Sensor Data</h4>
        
        <div className="sensor-group">
          <h5>Ultrasonic Sensors</h5>
          <div className="sensor-grid">
            <div className="sensor-item">
              <span>Front</span>
              <span>{rover.sensorData.ultrasonic.front} cm</span>
            </div>
            <div className="sensor-item">
              <span>Left</span>
              <span>{rover.sensorData.ultrasonic.left} cm</span>
            </div>
            <div className="sensor-item">
              <span>Right</span>
              <span>{rover.sensorData.ultrasonic.right} cm</span>
            </div>
            <div className="sensor-item">
              <span>Rear</span>
              <span>{rover.sensorData.ultrasonic.rear} cm</span>
            </div>
          </div>
        </div>

        <div className="sensor-group">
          <h5>IMU Data</h5>
          <div className="sensor-grid">
            <div className="sensor-item">
              <span>Accel X</span>
              <span>{rover.sensorData.imu.acceleration.x.toFixed(2)} m/s²</span>
            </div>
            <div className="sensor-item">
              <span>Accel Y</span>
              <span>{rover.sensorData.imu.acceleration.y.toFixed(2)} m/s²</span>
            </div>
            <div className="sensor-item">
              <span>Accel Z</span>
              <span>{rover.sensorData.imu.acceleration.z.toFixed(2)} m/s²</span>
            </div>
            <div className="sensor-item">
              <span>Temperature</span>
              <span>{rover.sensorData.imu.temperature.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        <div className="sensor-group">
          <h5>Environmental</h5>
          <div className="sensor-grid">
            <div className="sensor-item">
              <span>Temperature</span>
              <span>{rover.sensorData.environmental.temperature}°C</span>
            </div>
            <div className="sensor-item">
              <span>Humidity</span>
              <span>{rover.sensorData.environmental.humidity}%</span>
            </div>
            <div className="sensor-item">
              <span>Pressure</span>
              <span>{rover.sensorData.environmental.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rover-messages">
        <h4>System Messages</h4>
        <div className="messages-list">
          {rover.messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoverDetails;