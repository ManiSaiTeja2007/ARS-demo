// src/pages/Components.tsx
import React from 'react';
import ComponentGrid from '../components/UI/ComponentGrid';
import FeatureCard from '../components/Common/FeatureCard';

const Components: React.FC = () => {
  const components = [
    {
      name: "Arduino UNO R3",
      description: "Main control unit with sensor fusion and motor control",
      specifications: ["ATmega328P", "14 Digital I/O", "6 Analog Inputs", "16 MHz", "32KB Flash"],
      status: "operational" as const
    },
    {
      name: "NodeMCU ESP8266",
      description: "Wi-Fi mesh networking with BeeAdHoc protocol",
      specifications: ["ESP-12E", "Wi-Fi 802.11 b/g/n", "80MHz", "4MB Flash", "ESP-NOW Support"],
      status: "operational" as const
    },
    {
      name: "HC-SR04 Ultrasonic",
      description: "Distance measurement for obstacle detection",
      specifications: ["2-400cm Range", "3mm Accuracy", "15° Beam Angle", "40kHz Frequency"],
      status: "operational" as const
    },
    {
      name: "MPU6050 IMU",
      description: "6-axis motion tracking with gyroscope and accelerometer",
      specifications: ["±2000°/s Gyro", "±16g Accelerometer", "I2C Interface", "Digital Motion Processor"],
      status: "operational" as const
    },
    {
      name: "SG90 Servo",
      description: "Ultrasonic sensor positioning and steering",
      specifications: ["180° Rotation", "4.8V Operation", "0.12s/60° Speed", "9g Weight"],
      status: "operational" as const
    },
    {
      name: "L298N Motor Driver",
      description: "Dual H-bridge motor control for rover movement",
      specifications: ["46V Max", "2A Per Channel", "PWM Control", "Heat Sink"],
      status: "operational" as const
    }
  ];

  return (
    <div className="page components-page">
      <div className="page-header">
        <h1>System Components</h1>
        <p className="page-description">
          Comprehensive hardware and software components with specifications, 
          status monitoring, and integration details
        </p>
      </div>

      <div className="tile-grid">
        <div className="tile-row">
          <ComponentGrid components={components} />
        </div>

        <div className="tile-row">
          <FeatureCard
            title="Cost Analysis"
            description="Low-cost implementation with high-performance capabilities"
            icon="💰"
            color="#10b981"
            size="medium"
          >
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>Arduino UNO R3:</span>
                <span>$12</span>
              </div>
              <div className="cost-item">
                <span>NodeMCU ESP8266:</span>
                <span>$8</span>
              </div>
              <div className="cost-item">
                <span>HC-SR04 Ultrasonic:</span>
                <span>$3</span>
              </div>
              <div className="cost-item">
                <span>MPU6050 IMU:</span>
                <span>$4</span>
              </div>
              <div className="cost-item">
                <span>SG90 Servo:</span>
                <span>$3</span>
              </div>
              <div className="cost-item">
                <span>L298N Motor Driver:</span>
                <span>$5</span>
              </div>
              <div className="cost-item total">
                <span>Total per Rover:</span>
                <span>$35</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Power Management"
            description="Efficient power distribution with sleep modes and battery monitoring"
            icon="🔋"
            color="#f59e0b"
            size="medium"
          >
            <div className="power-stats">
              <div className="power-item">
                <span>Active Power:</span>
                <span>~500mA</span>
              </div>
              <div className="power-item">
                <span>Sleep Power:</span>
                <span>~50mA</span>
              </div>
              <div className="power-item">
                <span>Battery Life (Active):</span>
                <span>4-6 hours</span>
              </div>
              <div className="power-item">
                <span>Battery Life (Sleep):</span>
                <span>24+ hours</span>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default Components;
