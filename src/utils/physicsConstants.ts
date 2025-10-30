// src/utils/physicsConstants.ts
import type { Vector3 } from '../types';
export interface RoverPhysics {
  gravity: number;
  friction: number;
  drag: number;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  turnRate: number;
  sensorNoise: number;
  communicationRange: number;
  batteryDrain: number;
  collisionThreshold: number;
  sensorRange: {
    ultrasonic: number;
    infrared: number;
    lidar: number;
  };
}

export const ROVER_SPECS = {
  mass: 15, // kg
  wheelRadius: 0.1, // meters
  wheelBase: 0.6, // meters
  trackWidth: 0.5, // meters
  maxIncline: 30, // degrees
  batteryCapacity: 5000, // Wh
  powerConsumption: {
    idle: 50, // W
    moving: 150, // W
    max: 300 // W
  }
};

export const ENVIRONMENT_CONSTANTS = {
  marsSurfaceTemp: -63, // °C average
  marsAtmosphere: 0.006, // bar
  marsDustDensity: 0.02, // kg/m³
  solarFlux: 590, // W/m² at Mars
};

export const PHYSICS_CONSTANTS = {
  gravity: 3.711, // Mars gravity in m/s²
  friction: 0.3,
  drag: 0.1,
  roverMass: 15, // kg
  maxSpeed: 2.0, // m/s
  acceleration: 0.5, // m/s²
  deceleration: 1.0, // m/s²
  turnRate: 1.5, // rad/s
  sensorRange: 10.0, // meters
  communicationRange: 50.0, // meters
  batteryDrainRate: 0.1, // % per second
  collisionThreshold: 0.5, // meters
  obstacleDetectionRange: 5.0, // meters
  meshNetworkRange: 30.0, // meters
  signalAttenuation: 0.1, // dB per meter
  packetLossBase: 0.05, // 5% base packet loss
  latencyBase: 50, // ms base latency
};

export const calculateSignalStrength = (distance: number, maxRange: number = 50): number => {
  if (distance > maxRange) return -100;
  return -50 - (distance / maxRange) * 50;
};

export const calculateBatteryDrain = (velocity: number, angularVelocity: number, timeDelta: number): number => {
  const baseDrain = 0.01; // % per second base
  const movementDrain = (Math.abs(velocity) + Math.abs(angularVelocity)) * 0.1;
  return (baseDrain + movementDrain) * timeDelta;
};

export const applySensorNoise = (value: number, noiseLevel: number = 0.05): number => {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value;
  return Math.max(0, value + noise);
};

export const checkCollision = (roverPos: Vector3, obstaclePos: Vector3, threshold: number = PHYSICS_CONSTANTS.collisionThreshold): boolean => {
  const dx = roverPos.x - obstaclePos.x;
  const dz = roverPos.z - obstaclePos.z;
  return Math.sqrt(dx * dx + dz * dz) < threshold;
};