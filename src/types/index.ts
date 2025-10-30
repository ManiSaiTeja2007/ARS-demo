// src/types/index.ts - Enhanced with blueprint specifications
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface FlowStep {
  id: string;
  label: string;
  description: string;
  actor: 'Rover' | 'Leader' | 'Backend' | 'UI';
}

export interface Point {
  x: number;
  y: number;
}

export interface AlphaShape {
  points: Point[];
  hull: Point[];
  downsampled: boolean;
}

// Rover types matching blueprint
export interface Rover {
  id: number;
  mac: string;
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  angularVelocity: Vector3;
  acceleration: Vector3;
  status: 'idle' | 'moving' | 'avoiding' | 'communicating' | 'error';
  battery: number;
  role: 'scout' | 'forager' | 'sleep';
  mode: 'manual' | 'autonomous' | 'semi-auto';
  sensorData: SensorData;
  messages: string[];
  connected: boolean;
  color: string;
  wheelSpeeds: WheelSpeeds;
  path: { x: number; z: number }[];
  neighbors: number[];
  arsState?: ARSState;
  
  // Blueprint-specific fields
  cycle_id?: number;
  ts_cycle?: number;
  hash_seq?: number;
  hash?: string;
  rssi?: number;
  orientation_8?: number;
  sweep?: number[];
  meta?: {
    via_leader_mac?: string;
    hop_count?: number;
  };
}

export interface ARSState {
  mode: 'exploring' | 'avoiding' | 'mapping' | 'returning';
  direction: number;
  searchPhase: number;
  turnDirection: number;
  stuckCounter: number;
  lastPosition: Vector3;
}

export interface SensorData {
  ultrasonic: UltrasonicData;
  imu: IMUData;
  environmental: EnvironmentalData;
  servo: ServoData;
}

export interface UltrasonicData {
  front: number;
  left: number;
  right: number;
  rear: number;
}

export interface IMUData {
  acceleration: Vector3;
  gyro: Vector3;
  orientation: Vector3;
  temperature: number;
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface ServoData {
  angle: number;
}

export interface WheelSpeeds {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
}

export interface SimulationState {
  running: boolean;
  timeScale: number;
  showSensors: boolean;
  showGrid: boolean;
  showPaths: boolean;
  cameraMode: 'orbit' | 'follow' | 'top';
  physics: PhysicsConstants;
  showMeshNetwork: boolean;
  showCommunicationLines: boolean;
}

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  speed: number;
  emergencyStop: boolean;
}

export interface Obstacle {
  id: number;
  position: Vector3;
  type: 'rock' | 'wall' | 'hole';
  size: { width: number; height: number; depth: number };
  boundingBox: { min: Vector3; max: Vector3 };
}

export interface MeshNode {
  id: number;
  position: Vector3;
  neighbors: number[];
  role: string;
  signalStrength: number;
}

export interface PhysicsConstants {
  gravity: number;
  friction: number;
  drag: number;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  turnRate: number;
  sensorNoise: number;
  communicationRange: number;
}

export interface ArchitectureLayer {
  name: string;
  components: string[];
  color: string;
}

export interface DataFlow {
  from: string;
  to: string;
  type: string;
  data: string;
}

export interface SystemComponent {
  name: string;
  description: string;
  specifications: string[];
  status: 'operational' | 'degraded' | 'offline';
}

// Blueprint-specific types
export interface CanonicalJSON {
  type: 'telemetry' | 'heartbeat' | 'self_location' | 'alert' | 'registration';
  cycle_id: number;
  ts_cycle: number;
  rover_mac: string;
  hash_seq: number;
  hash: string;
  rssi: number;
  role: 'scout' | 'forager' | 'sleep';
  battery: number;
  pose: { x: number; y: number; heading_deg: number };
  mpu: any;
  orientation_8?: number;
  sweep: number[];
  meta?: any;
}

export interface ValidationStep {
  step: number;
  name: string;
  description: string;
}