// src/components/UI/FusionEKF.tsx (New component)
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const sampleData = [
  { time: 0, poseX: 0, fusedX: 0 },
  { time: 1, poseX: 1.2, fusedX: 1.0 },
  { time: 2, poseX: 2.5, fusedX: 2.1 },
  { time: 3, poseX: 3.8, fusedX: 3.4 },
  { time: 4, poseX: 5.1, fusedX: 4.7 },
];

const FusionEKF: React.FC = () => {
  return (
    <div className="ekf-chart">
      <h3>Global EKF Pose Fusion</h3>
      <LineChart width={400} height={300} data={sampleData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="poseX" name="Raw Pose" stroke="#8884d8" />
        <Line type="monotone" dataKey="fusedX" name="Fused Pose" stroke="#82ca9d" />
      </LineChart>
      <p>Inputs: IMU, dead-reckoning, sweeps, RSSI. Target: 50ms per update.</p>
    </div>
  );
};

export default FusionEKF;