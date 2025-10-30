// src/pages/Architecture.tsx
import React from 'react';
import ArchitectureDiagram from '../components/UI/ArchitectureDiagram';
import FeatureCard from '../components/Common/FeatureCard';
import CodeTile from '../components/Common/CodeTile';

const Architecture: React.FC = () => {
  const layers = [
    {
      name: "Master Layer (Python Tkinter GUI)",
      components: [
        "Voting-Based Leader Election", 
        "Gesture Control Integration", 
        "Command Interface (Unicast/Multicast/Broadcast)",
        "Real-time Visualization"
      ],
      color: "#2dd4bf"
    },
    {
      name: "Mesh Layer (NodeMCU ESP8266)",
      components: [
        "BeeAdHoc Protocol Implementation", 
        "RSSI-Based Neighbor Selection", 
        "MAC Registry Security",
        "Adaptive Sleep Modes"
      ],
      color: "#60a5fa"
    },
    {
      name: "Control Layer (Arduino UNO R3)",
      components: [
        "Sensor Fusion & Kalman Filtering", 
        "SHA-1 Security Hashing", 
        "Mode Switching Logic",
        "Motor Control Algorithms"
      ],
      color: "#f59e0b"
    },
    {
      name: "Physical Layer (Sensors & Actuators)",
      components: [
        "HC-SR04 Ultrasonic (2-400cm)", 
        "MPU6050 IMU (±2000°/s)", 
        "SG90 Servo (180°)",
        "L298N Motor Driver"
      ],
      color: "#ef4444"
    }
  ];

  const dataFlow = [
    { from: "Master", to: "Mesh", type: "Wi-Fi Gateway", data: "Commands, Gesture Data" },
    { from: "Mesh", to: "Control", type: "Serial", data: "Processed Commands, Sensor Data" },
    { from: "Control", to: "Physical", type: "I2C/GPIO", data: "Motor Commands, Servo Control" },
    { from: "Physical", to: "Control", type: "Sensor Data", data: "Distance, Orientation, Temperature" }
  ];

  const asciiArchitecture = `
[Master GUI (Python Tkinter, Optional)] <--- Wi-Fi Gateway (Unicast/Multicast/Broadcast) ---> [Layer 1: Leader NodeMCU (Real Rover, MAC Registry)]
                                                   |                                      |
                                                   v                                      v
[Layer 2: Follower Rovers (Imaginary in Web Sim)] <-- ESP-NOW/PainlessMesh (Multi-Hop, Decentralized Broadcast) --> [Arduino (Control/Sensors)]
                                                   |                                      |
                                                   v                                      v
[Obstacle/Danger Data (Broadcasted)] <-- Serial/I2C (Local, Reliable) --> [Actuators (Motors/Servo, Optimized Memory)]

Security/Memory Flows:
- MAC Propagation: Broadcast "hello" packets with MACs; verify against registry (fast lookup array).
- Intruder Hash: On new join/offline recovery, compute SHA-1(MAC + Timestamp); if mismatch, alert/broadcast.
- Memory: Obstacle maps in SPIFFS (compact arrays, e.g., uint8_t grid[100]); free RAM by avoiding strings.
`;

  return (
    <div className="page architecture-page">
      <div className="page-header">
        <h1>System Architecture</h1>
        <p className="page-description">
          Advanced Multi-Layer Decentralized Ad Hoc Mesh Architecture with Localized BeeAdHoc Enhancement
        </p>
      </div>

      <div className="tile-grid">
        {/* Architecture Diagram */}
        <div className="tile-row">
          <ArchitectureDiagram 
            layers={layers}
            dataFlow={dataFlow}
            size="wide"
          />
        </div>

        {/* ASCII Architecture Diagram */}
        <div className="tile-row">
          <div className="tile size-wide">
            <h3>Text-Based Architecture Schematic</h3>
            <pre className="ascii-architecture">
              {asciiArchitecture}
            </pre>
          </div>
        </div>

        {/* Layer Details */}
        <div className="tile-row">
          {layers.map((layer, index) => (
            <FeatureCard
              key={index}
              title={layer.name}
              description="Advanced component layer with specialized functionality"
              color={layer.color}
              size="medium"
            >
              <div className="layer-components">
                {layer.components.map((comp, idx) => (
                  <div key={idx} className="component-item">
                    <div className="component-dot" style={{ backgroundColor: layer.color }}></div>
                    {comp}
                  </div>
                ))}
              </div>
            </FeatureCard>
          ))}
        </div>

        {/* Data Flow Example */}
        <div className="tile-row">
          <CodeTile
            title="BeeAdHoc Neighbor Selection Algorithm"
            description="RSSI-based neighbor selection with role assignment"
            language="cpp"
            size="medium"
          >
{`// BeeAdHoc Neighbor Selection
void selectNeighbor() {
  int n = WiFi.scanNetworks();
  int maxRSSI = -100; 
  String closest = "";

  for (int i = 0; i < n; ++i) {
    if (WiFi.RSSI(i) > maxRSSI) {
      maxRSSI = WiFi.RSSI(i);
      closest = WiFi.BSSIDstr(i);
    }
  }

  if (maxRSSI > -70) {
    nearestMAC = closest;
    assignRole(maxRSSI); // Scout if strong signal
  }
}

void assignRole(int rssi) {
  if (rssi > -60) {
    currentRole = ROLE_SCOUT;  // Active sensing
  } else {
    currentRole = ROLE_FORAGER; // Data relay
    enterSleepMode(); // Power saving
  }
}`}
          </CodeTile>

          <FeatureCard
            title="Security & Memory Management"
            description="MAC registry security with optimized memory usage"
            icon="🔒"
            color="#10b981"
            size="medium"
          >
            <div className="memory-stats">
              <div className="memory-item">
                <span>MAC Registry:</span>
                <span>2KB RAM</span>
              </div>
              <div className="memory-item">
                <span>Obstacle Map:</span>
                <span>5KB SPIFFS</span>
              </div>
              <div className="memory-item">
                <span>SHA-1 Hash:</span>
                <span>10ms computation</span>
              </div>
              <div className="memory-item">
                <span>Free RAM:</span>
                <span>~40KB available</span>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
