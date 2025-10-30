import type { Point, AlphaShape, FlowStep } from '../types';

// Helper to generate sample alpha-shape data
export const generateAlphaShape = (numPoints: number = 500): AlphaShape => {
  const points: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({ x: Math.random() * 10, y: Math.random() * 10 });
  }
  // Simulate downsampling if >500
  const downsampled = numPoints > 500;
  return { points: downsampled ? points.slice(0, 500) : points, hull: points.slice(0, 20), downsampled };
};

// Helper for flow diagrams (simple linear flow)
export const generateFlowSteps = (flowType: string): FlowStep[] => {
  if (flowType === 'telemetry') {
    return [
      { id: '1', label: 'Rover Sweep', description: 'Perform ultrasonic sweep', actor: 'Rover' },
      { id: '2', label: 'Pack Frame', description: 'Create compact ESP-NOW frame', actor: 'Rover' },
      { id: '3', label: 'Send to Leader', description: 'ESP-NOW transmission', actor: 'Rover' },
      { id: '4', label: 'Unpack & JSON', description: 'Convert to canonical JSON', actor: 'Leader' },
      { id: '5', label: 'UDP to Backend', description: 'Send over UDP', actor: 'Leader' },
      { id: '6', label: 'Validate & Process', description: 'Time, MAC, Hash, etc.', actor: 'Backend' },
      { id: '7', label: 'Fusion & Geometry', description: 'EKF and alpha-shape', actor: 'Backend' },
      { id: '8', label: 'WebSocket Push', description: 'Update UI', actor: 'Backend' },
    ];
  }
  // Add more flow types as needed
  return [];
};