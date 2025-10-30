// src/utils/physicsConstants.ts
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

export const PHYSICS_CONSTANTS: RoverPhysics = {
  gravity: 3.711, // Mars gravity in m/s²
  friction: 0.3,
  drag: 0.1,
  maxSpeed: 2.5, // m/s
  acceleration: 1.5, // m/s²
  deceleration: 2.0, // m/s²
  turnRate: 2.0, // rad/s
  sensorNoise: 0.05,
  communicationRange: 50, // meters
  batteryDrain: 0.1, // % per second at max speed
  collisionThreshold: 0.5, // meters
  sensorRange: {
    ultrasonic: 4.0, // meters
    infrared: 1.5, // meters
    lidar: 10.0 // meters
  }
};

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

export const calculateSignalStrength = (distance: number, maxRange: number = 50): number => {
  if (distance > maxRange) return -100;
  return -50 - (distance / maxRange) * 50;
};

export const calculateBatteryDrain = (velocity: number, angularVelocity: number, timeDelta: number): number => {
  const baseDrain = ROVER_SPECS.powerConsumption.idle / 3600; // W per second
  const movementDrain = (Math.abs(velocity) * ROVER_SPECS.powerConsumption.moving + 
                         Math.abs(angularVelocity) * ROVER_SPECS.powerConsumption.max) / 3600;
  return (baseDrain + movementDrain) * timeDelta;
};

export const applySensorNoise = (value: number, noiseLevel: number = PHYSICS_CONSTANTS.sensorNoise): number => {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value;
  return Math.max(0, value + noise);
};

export const checkCollision = (roverPos: Vector3, obstaclePos: Vector3, threshold: number = PHYSICS_CONSTANTS.collisionThreshold): boolean => {
  const dx = roverPos.x - obstaclePos.x;
  const dz = roverPos.z - obstaclePos.z;
  return Math.sqrt(dx * dx + dz * dz) < threshold;
};