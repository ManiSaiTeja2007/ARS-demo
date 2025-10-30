// src/pages/Simulation.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import ControlPanel from '../components/UI/ControlPanel';
import RoverDetails from '../components/UI/RoverDetails';
import { RoverPhysics, PHYSICS_CONSTANTS } from '../utils/physicsConstants';
import type { Rover, SimulationState, ControlState, Obstacle, MeshNode } from '../types';

// Professional color scheme
const COLORS = {
  primary: '#1a365d',
  secondary: '#2d3748',
  accent: '#3182ce',
  danger: '#e53e3e',
  warning: '#dd6b20',
  success: '#38a169',
  background: '#0f172a',
  grid: '#334155',
  roverBody: '#4a5568',
  roverWheels: '#1a202c',
  sensorActive: '#00ff88',
  sensorInactive: '#ff4444'
};

// Custom Line component
const Line: React.FC<{
  points: THREE.Vector3[];
  color: string;
  lineWidth?: number;
  transparent?: boolean;
  opacity?: number;
}> = ({ points, color, lineWidth = 2, transparent = false, opacity = 1 }) => {
  const lineRef = useRef<THREE.Line>(null);

  useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry = geometry;
    }
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial 
        color={color} 
        linewidth={lineWidth}
        transparent={transparent}
        opacity={opacity}
      />
    </line>
  );
};

// Custom Circle component to replace missing @react-three/drei Circle
const Circle: React.FC<{
  args: [number, number];
  rotation: [number, number, number];
  children?: React.ReactNode;
}> = ({ args, rotation, children }) => {
  return (
    <mesh rotation={rotation}>
      <ringGeometry args={[args[0] - 0.05, args[0], args[1]]} />
      {children}
    </mesh>
  );
};

// Enhanced Ultrasonic Sensor Visualization
const UltrasonicSensorView: React.FC<{
  position: [number, number, number];
  rotation: number;
  range: number;
  angle: number;
  detectedDistance: number;
  active: boolean;
}> = ({ position, rotation, range, angle, detectedDistance, active }) => {
  const points = React.useMemo(() => {
    const sectorPoints = [];
    const segments = 12;
    
    // Start from rover position
    sectorPoints.push(new THREE.Vector3(0, 0.1, 0));
    
    // Create arc points
    for (let i = 0; i <= segments; i++) {
      const currentAngle = -angle/2 + (angle * i / segments) + rotation;
      const distance = Math.min(detectedDistance, range);
      const x = Math.sin(currentAngle) * distance;
      const z = Math.cos(currentAngle) * distance;
      sectorPoints.push(new THREE.Vector3(x, 0.1, z));
    }
    
    // Close the sector
    sectorPoints.push(new THREE.Vector3(0, 0.1, 0));
    
    return sectorPoints;
  }, [rotation, range, angle, detectedDistance]);

  const color = active ? 
    (detectedDistance < range * 0.3 ? COLORS.danger : 
     detectedDistance < range * 0.6 ? COLORS.warning : COLORS.success) : COLORS.grid;

  return (
    <group position={position}>
      <Line 
        points={points}
        color={color}
        transparent
        opacity={active ? 0.6 : 0.2}
      />
    </group>
  );
};

// Enhanced Protective Rings
const ProtectiveRings: React.FC<{
  neighborCount: number;
  active: boolean;
}> = ({ neighborCount, active }) => {
  const opacity = active ? 0.8 : 0.3;
  
  return (
    <group>
      {/* Ring 1: Collision Avoidance (20cm) */}
      <Circle args={[0.2, 32]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={COLORS.danger} transparent opacity={opacity} wireframe />
      </Circle>
      
      {/* Ring 2: Neighbor Counting (Dynamic 1-5 units) */}
      <Circle args={[0.2 + (neighborCount * 0.8), 32]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={COLORS.warning} transparent opacity={opacity} wireframe />
      </Circle>
      
      {/* Ring 3: ESP-NOW Range (50m) */}
      <Circle args={[5, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={COLORS.success} transparent opacity={opacity} wireframe />
      </Circle>
    </group>
  );
};

// Professional 3-Wheel Rover Model
const RoverModel = ({ 
  position, 
  rotation, 
  color, 
  role,
  isLeader,
  neighborCount,
  sensorData,
  active
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  color: string;
  role: string;
  isLeader: boolean;
  neighborCount: number;
  sensorData: any;
  active: boolean;
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Protective Rings */}
      <ProtectiveRings neighborCount={neighborCount} active={active} />
      
      {/* Rover Body */}
      <group>
        {/* Main chassis */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.8]} />
          <meshStandardMaterial color={active ? color : COLORS.grid} />
        </mesh>
        
        {/* Sensor module */}
        <mesh position={[0, 0.3, 0.2]}>
          <boxGeometry args={[0.3, 0.08, 0.2]} />
          <meshStandardMaterial color={active ? COLORS.accent : '#4a5568'} />
        </mesh>
        
        {/* Motor Wheels (rear) */}
        <mesh position={[-0.2, 0, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color={COLORS.roverWheels} />
        </mesh>
        <mesh position={[0.2, 0, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color={COLORS.roverWheels} />
        </mesh>
        
        {/* Free wheel (front) */}
        <mesh position={[0, 0.06, -0.3]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      </group>

      {/* Ultrasonic Sensor Views */}
      <UltrasonicSensorView
        position={[0, 0.3, 0.2]}
        rotation={rotation[1]}
        range={4}
        angle={Math.PI / 6}
        detectedDistance={sensorData.ultrasonic.front / 100}
        active={active}
      />
      <UltrasonicSensorView
        position={[0.2, 0.3, 0.15]}
        rotation={rotation[1] + Math.PI / 4}
        range={3}
        angle={Math.PI / 8}
        detectedDistance={sensorData.ultrasonic.left / 100}
        active={active}
      />
      <UltrasonicSensorView
        position={[-0.2, 0.3, 0.15]}
        rotation={rotation[1] - Math.PI / 4}
        range={3}
        angle={Math.PI / 8}
        detectedDistance={sensorData.ultrasonic.right / 100}
        active={active}
      />

      {/* Status indicator */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.15]} />
        <meshStandardMaterial color={
          !active ? '#4a5568' :
          isLeader ? COLORS.danger : 
          role === 'scout' ? COLORS.warning : COLORS.success
        } />
      </mesh>

      {/* Leader indicator */}
      {isLeader && active && (
        <group position={[0, 0.5, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.1, 8]} />
            <meshStandardMaterial color="#ffd700" />
          </mesh>
        </group>
      )}
    </group>
  );
};

const CommunicationLine = ({ 
  start, 
  end, 
  strength,
  active
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  strength: number;
  active: boolean;
}) => {
  const points = React.useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const color = !active ? COLORS.grid : 
               strength > -60 ? COLORS.success : 
               strength > -70 ? COLORS.warning : COLORS.danger;

  return (
    <Line 
      points={points} 
      color={color} 
      lineWidth={active ? (strength > -60 ? 3 : strength > -70 ? 2 : 1) : 1}
      transparent
      opacity={active ? 0.6 : 0.2}
    />
  );
};

// Enhanced Maze Generation
const generateMaze = (width: number, height: number, complexity: number): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const gridSize = 2;
  
  // Create border walls
  for (let x = -width/2; x <= width/2; x += gridSize) {
    obstacles.push({
      id: obstacles.length + 1,
      position: { x: x, y: 0, z: -height/2 },
      type: 'wall',
      size: { width: gridSize, height: 1, depth: 0.5 },
      boundingBox: { 
        min: { x: x - gridSize/2, y: 0, z: -height/2 - 0.25 }, 
        max: { x: x + gridSize/2, y: 1, z: -height/2 + 0.25 } 
      }
    });
    obstacles.push({
      id: obstacles.length + 1,
      position: { x: x, y: 0, z: height/2 },
      type: 'wall',
      size: { width: gridSize, height: 1, depth: 0.5 },
      boundingBox: { 
        min: { x: x - gridSize/2, y: 0, z: height/2 - 0.25 }, 
        max: { x: x + gridSize/2, y: 1, z: height/2 + 0.25 } 
      }
    });
  }
  
  for (let z = -height/2; z <= height/2; z += gridSize) {
    obstacles.push({
      id: obstacles.length + 1,
      position: { x: -width/2, y: 0, z: z },
      type: 'wall',
      size: { width: 0.5, height: 1, depth: gridSize },
      boundingBox: { 
        min: { x: -width/2 - 0.25, y: 0, z: z - gridSize/2 }, 
        max: { x: -width/2 + 0.25, y: 1, z: z + gridSize/2 } 
      }
    });
    obstacles.push({
      id: obstacles.length + 1,
      position: { x: width/2, y: 0, z: z },
      type: 'wall',
      size: { width: 0.5, height: 1, depth: gridSize },
      boundingBox: { 
        min: { x: width/2 - 0.25, y: 0, z: z - gridSize/2 }, 
        max: { x: width/2 + 0.25, y: 1, z: z + gridSize/2 } 
      }
    });
  }

  // Add internal maze walls
  for (let i = 0; i < complexity; i++) {
    const isHorizontal = Math.random() > 0.5;
    const x = Math.floor((Math.random() * (width - 4) - width/2 + 2) / gridSize) * gridSize;
    const z = Math.floor((Math.random() * (height - 4) - height/2 + 2) / gridSize) * gridSize;
    const length = 2 + Math.floor(Math.random() * 4);
    
    if (isHorizontal) {
      obstacles.push({
        id: obstacles.length + 1,
        position: { x: x, y: 0, z: z },
        type: 'wall',
        size: { width: length * gridSize, height: 1, depth: 0.5 },
        boundingBox: { 
          min: { x: x - (length * gridSize)/2, y: 0, z: z - 0.25 }, 
          max: { x: x + (length * gridSize)/2, y: 1, z: z + 0.25 } 
        }
      });
    } else {
      obstacles.push({
        id: obstacles.length + 1,
        position: { x: x, y: 0, z: z },
        type: 'wall',
        size: { width: 0.5, height: 1, depth: length * gridSize },
        boundingBox: { 
          min: { x: x - 0.25, y: 0, z: z - (length * gridSize)/2 }, 
          max: { x: x + 0.25, y: 1, z: z + (length * gridSize)/2 } 
        }
      });
    }
  }

  return obstacles;
};

// Enhanced Autonomous Rover System (ARS) Logic
class ARSLogic {
  static exploreUntilObstacle(rover: Rover, obstacles: Obstacle[], delta: number): Rover {
    const state = rover.arsState || {
      mode: 'exploring',
      direction: rover.rotation.y,
      searchPhase: 0,
      turnDirection: 1,
      stuckCounter: 0,
      lastPosition: { ...rover.position }
    };

    // Check if stuck (not moving)
    const movedDistance = Math.sqrt(
      Math.pow(rover.position.x - state.lastPosition.x, 2) +
      Math.pow(rover.position.z - state.lastPosition.z, 2)
    );
    
    if (movedDistance < 0.1) {
      state.stuckCounter += delta;
    } else {
      state.stuckCounter = 0;
    }
    
    state.lastPosition = { ...rover.position };

    // Get sensor data
    const frontDist = rover.sensorData.ultrasonic.front;
    const leftDist = rover.sensorData.ultrasonic.left;
    const rightDist = rover.sensorData.ultrasonic.right;

    // State machine for ARS
    switch (state.mode) {
      case 'exploring':
        // Move forward until obstacle detected
        rover.velocity.z = 0.8;
        
        if (frontDist < 80 || state.stuckCounter > 2) {
          state.mode = 'avoiding';
          state.searchPhase = 0;
          state.turnDirection = leftDist > rightDist ? 1 : -1;
          rover.velocity.z = 0;
        }
        break;

      case 'avoiding':
        // Turn to find clear path
        rover.velocity.z = 0.2;
        rover.rotation.y += state.turnDirection * 0.05;
        state.searchPhase += delta;

        if (frontDist > 150 && state.searchPhase > 1) {
          state.mode = 'exploring';
          state.stuckCounter = 0;
        } else if (state.searchPhase > 3) {
          // Try opposite direction if stuck
          state.turnDirection *= -1;
          state.searchPhase = 0;
        }
        break;

      case 'mapping':
        // Systematic exploration pattern
        rover.velocity.z = 0.6;
        break;
    }

    rover.arsState = state;
    return rover;
  }
}

const SimulationScene = ({ 
  rovers, 
  setRovers, 
  simulationState, 
  controlState, 
  obstacles,
  meshNodes,
  leaderId
}: {
  rovers: Rover[];
  setRovers: (rovers: Rover[]) => void;
  simulationState: SimulationState;
  controlState: ControlState;
  obstacles: Obstacle[];
  meshNodes: MeshNode[];
  leaderId: number;
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const explorationMapRef = useRef<Set<string>>(new Set());

  // Calculate neighbor counts
  const calculateNeighborCounts = useCallback((rovers: Rover[]): Map<number, number> => {
    const counts = new Map<number, number>();
    
    rovers.forEach(rover => {
      let count = 0;
      rovers.forEach(other => {
        if (rover.id !== other.id) {
          const distance = Math.sqrt(
            Math.pow(rover.position.x - other.position.x, 2) +
            Math.pow(rover.position.z - other.position.z, 2)
          );
          if (distance >= 1 && distance <= 5) {
            count++;
          }
        }
      });
      counts.set(rover.id, count);
    });
    
    return counts;
  }, []);

  // Calculate sensor distances with raycasting simulation
  const calculateSensorDistances = useCallback((rover: Rover, obstacles: Obstacle[]): {front: number, left: number, right: number} => {
    const sensorRanges = { front: 400, left: 300, right: 300 };
    const detected = { front: sensorRanges.front, left: sensorRanges.left, right: sensorRanges.right };

    obstacles.forEach(ob => {
      const dx = ob.position.x - rover.position.x;
      const dz = ob.position.z - rover.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz) * 100; // Convert to cm
      const angleToObstacle = Math.atan2(dx, dz) - rover.rotation.y;

      // Normalize angle
      let normalizedAngle = angleToObstacle;
      while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
      while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

      // Front sensor (30° cone)
      if (Math.abs(normalizedAngle) < Math.PI / 12 && distance < detected.front) {
        detected.front = distance;
      }
      // Left sensor (22.5° cone)
      if (normalizedAngle > Math.PI / 8 && normalizedAngle < Math.PI / 4 && distance < detected.left) {
        detected.left = distance;
      }
      // Right sensor (22.5° cone)
      if (normalizedAngle < -Math.PI / 8 && normalizedAngle > -Math.PI / 4 && distance < detected.right) {
        detected.right = distance;
      }
    });

    return detected;
  }, []);

  useFrame((state, delta) => {
    if (!simulationState.running) return;

    const updatedRovers = [...rovers];
    const scaledDelta = delta * simulationState.timeScale;
    const neighborCounts = calculateNeighborCounts(updatedRovers);

    updatedRovers.forEach((rover, index) => {
      // Update sensor data
      const sensorDistances = calculateSensorDistances(rover, obstacles);
      rover.sensorData.ultrasonic = sensorDistances;

      // Apply ARS logic for autonomous rovers
      if (rover.mode === 'autonomous') {
        rover = ARSLogic.exploreUntilObstacle(rover, obstacles, scaledDelta);
        
        // Update position based on velocity and rotation
        rover.position.x += Math.sin(rover.rotation.y) * rover.velocity.z * scaledDelta;
        rover.position.z += Math.cos(rover.rotation.y) * rover.velocity.z * scaledDelta;
      }

      // Manual control override
      if (rover.mode === 'manual') {
        const throttle = (controlState.forward ? 1 : 0) - (controlState.backward ? 1 : 0);
        const steering = (controlState.right ? 1 : 0) - (controlState.left ? 1 : 0);
        
        rover.velocity.z = throttle * controlState.speed;
        rover.rotation.y += steering * 0.05;

        rover.position.x += Math.sin(rover.rotation.y) * rover.velocity.z * scaledDelta;
        rover.position.z += Math.cos(rover.rotation.y) * rover.velocity.z * scaledDelta;
      }

      // Update exploration map
      const gridX = Math.round(rover.position.x);
      const gridZ = Math.round(rover.position.z);
      explorationMapRef.current.add(`${gridX},${gridZ}`);

      // Update path
      rover.path.push({ x: rover.position.x, z: rover.position.z });
      if (rover.path.length > 50) rover.path.shift();

      // Update battery (drain based on movement)
      rover.battery -= Math.abs(rover.velocity.z) * 0.01 * scaledDelta;
      rover.battery = Math.max(0, rover.battery);

      updatedRovers[index] = rover;
    });

    setRovers(updatedRovers);

    // Camera control
    if (cameraRef.current) {
      if (simulationState.cameraMode === 'follow') {
        const rover = updatedRovers.find(r => r.id === leaderId) || updatedRovers[0];
        cameraRef.current.position.set(
          rover.position.x - 8 * Math.sin(rover.rotation.y),
          6,
          rover.position.z - 8 * Math.cos(rover.rotation.y)
        );
        cameraRef.current.lookAt(rover.position.x, rover.position.y + 1, rover.position.z);
      } else if (simulationState.cameraMode === 'top') {
        cameraRef.current.position.set(0, 20, 0);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  });

  const neighborCounts = calculateNeighborCounts(rovers);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={60} position={[0, 15, 20]} />
      <OrbitControls enabled={simulationState.cameraMode === 'orbit'} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={COLORS.background} />
      </mesh>

      {/* Grid */}
      {simulationState.showGrid && (
        <gridHelper args={[100, 50, COLORS.grid, COLORS.grid]} />
      )}

      {/* Rovers */}
      {rovers.map((rover) => (
        <RoverModel 
          key={rover.id} 
          position={[rover.position.x, rover.position.y, rover.position.z]} 
          rotation={[0, rover.rotation.y, 0]} 
          color={rover.color}
          role={rover.role}
          isLeader={rover.id === leaderId}
          neighborCount={neighborCounts.get(rover.id) || 0}
          sensorData={rover.sensorData}
          active={simulationState.running}
        />
      ))}

      {/* Obstacles */}
      {obstacles.map((ob) => (
        <mesh 
          key={ob.id} 
          position={[ob.position.x, ob.position.y + ob.size.height/2, ob.position.z]}
        >
          <boxGeometry args={[ob.size.width, ob.size.height, ob.size.depth]} />
          <meshStandardMaterial color={ob.type === 'rock' ? COLORS.warning : COLORS.secondary} />
        </mesh>
      ))}

      {/* Communication lines */}
      {simulationState.showCommunicationLines && meshNodes.map((node) =>
        node.neighbors.map(neighborId => {
          const neighbor = meshNodes.find(n => n.id === neighborId);
          if (!neighbor) return null;
          
          return (
            <CommunicationLine 
              key={`${node.id}-${neighborId}`}
              start={[node.position.x, 0.5, node.position.z]}
              end={[neighbor.position.x, 0.5, neighbor.position.z]}
              strength={node.signalStrength}
              active={simulationState.running}
            />
          );
        })
      )}

      {/* Path visualization */}
      {simulationState.showPaths && rovers.map((rover) => (
        <Line 
          key={`path-${rover.id}`}
          points={rover.path.map(p => new THREE.Vector3(p.x, 0.02, p.z))}
          color={rover.color}
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  );
};

const Simulation: React.FC = () => {
  const [rovers, setRovers] = useState<Rover[]>([
    {
      id: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      status: 'exploring',
      battery: 100,
      sensorData: {
        ultrasonic: { front: 400, left: 300, right: 300, rear: 400 },
        imu: { acceleration: { x: 0, y: 0, z: 0 }, gyro: { x: 0, y: 0, z: 0 }, orientation: { roll: 0, pitch: 0, yaw: 0 }, temperature: 25 },
        environmental: { temperature: 25, humidity: 50, pressure: 1013 },
        servo: { angle: 90 }
      },
      messages: ['ARS: Exploring area'],
      connected: true,
      color: COLORS.accent,
      mode: 'autonomous',
      wheelSpeeds: { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 },
      path: [],
      role: 'leader',
      neighbors: [2, 3],
      arsState: {
        mode: 'exploring',
        direction: 0,
        searchPhase: 0,
        turnDirection: 1,
        stuckCounter: 0,
        lastPosition: { x: 0, y: 0, z: 0 }
      },
      // Add missing required properties
      explorationData: {
        exploredArea: 0,
        mappedObstacles: 0,
        explorationGrid: new Set(),
        frontierCells: [],
        heatmap: {}
      },
      communication: {
        signalStrength: -50,
        packetLoss: 0,
        latency: 0,
        connectedNodes: [],
        lastCommunication: Date.now(),
        bandwidth: 0
      },
      health: {
        temperature: 25,
        motorHealth: { frontLeft: 1, frontRight: 1, rearLeft: 1, rearRight: 1 },
        sensorHealth: { ultrasonic: 1, imu: 1, environmental: 1 },
        systemUptime: 0,
        errorCodes: []
      },
      capabilities: {
        maxSpeed: 2.5,
        sensorRange: 400,
        batteryCapacity: 100,
        communicationRange: 50,
        payloadCapacity: 2,
        terrainTypes: ['flat', 'slope', 'rocky']
      },
      taskQueue: [],
      lastUpdate: Date.now()
    }
  ]);

  const [simulationState, setSimulationState] = useState<SimulationState>({
    running: true,
    timeScale: 1.0,
    showSensors: true,
    showGrid: true,
    showPaths: true,
    cameraMode: 'orbit',
    physics: PHYSICS_CONSTANTS,
    showMeshNetwork: true,
    showCommunicationLines: true,
    // Add missing required properties
    explorationMode: 'individual',
    environmentType: 'indoor',
    difficulty: 'medium',
    realTimeData: true,
    showHeatmap: false,
    showFrontiers: false,
    showObstacleMemory: false
  });

  const [controlState, setControlState] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 1.0,
    // Add missing required properties
    emergencyStop: false,
    maxSpeedLimit: 2.5,
    safetyEnabled: true,
    controlMode: 'direct'
  });

  const [selectedRover, setSelectedRover] = useState<Rover>(rovers[0]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [leaderId, setLeaderId] = useState<number>(1);
  const [imaginaryRoverActive, setImaginaryRoverActive] = useState(false);
  const [gestureControlActive, setGestureControlActive] = useState(false);

  // Initialize maze
  useEffect(() => {
    const maze = generateMaze(40, 40, 15);
    setObstacles(maze);
  }, []);

  const meshNodes: MeshNode[] = rovers.map(rover => ({
    id: rover.id,
    position: rover.position,
    neighbors: rover.neighbors,
    role: rover.role,
    signalStrength: -50 - Math.random() * 30,
    // Add missing required properties
    packetLoss: 0,
    latency: 0,
    bandwidth: 0,
    routingTable: [],
    lastSeen: Date.now()
  }));

  // Add new rover
  const addRover = (position: { x: number, z: number }) => {
    const newId = Math.max(...rovers.map(r => r.id)) + 1;
    const newRover: Rover = {
      id: newId,
      position: { x: position.x, y: 0, z: position.z },
      rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      status: 'exploring',
      battery: 100,
      sensorData: {
        ultrasonic: { front: 400, left: 300, right: 300, rear: 400 },
        imu: { acceleration: { x: 0, y: 0, z: 0 }, gyro: { x: 0, y: 0, z: 0 }, orientation: { roll: 0, pitch: 0, yaw: 0 }, temperature: 25 },
        environmental: { temperature: 25, humidity: 50, pressure: 1013 },
        servo: { angle: 90 }
      },
      messages: ['ARS: New rover deployed'],
      connected: true,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      mode: 'autonomous',
      wheelSpeeds: { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 },
      path: [],
      role: 'scout',
      neighbors: [],
      arsState: {
        mode: 'exploring',
        direction: 0,
        searchPhase: 0,
        turnDirection: 1,
        stuckCounter: 0,
        lastPosition: { x: position.x, y: 0, z: position.z }
      },
      // Add missing required properties
      explorationData: {
        exploredArea: 0,
        mappedObstacles: 0,
        explorationGrid: new Set(),
        frontierCells: [],
        heatmap: {}
      },
      communication: {
        signalStrength: -50,
        packetLoss: 0,
        latency: 0,
        connectedNodes: [],
        lastCommunication: Date.now(),
        bandwidth: 0
      },
      health: {
        temperature: 25,
        motorHealth: { frontLeft: 1, frontRight: 1, rearLeft: 1, rearRight: 1 },
        sensorHealth: { ultrasonic: 1, imu: 1, environmental: 1 },
        systemUptime: 0,
        errorCodes: []
      },
      capabilities: {
        maxSpeed: 2.5,
        sensorRange: 400,
        batteryCapacity: 100,
        communicationRange: 50,
        payloadCapacity: 2,
        terrainTypes: ['flat', 'slope', 'rocky']
      },
      taskQueue: [],
      lastUpdate: Date.now()
    };
    setRovers([...rovers, newRover]);
  };

  // Add random obstacle
  const addRandomObstacle = () => {
    const x = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 30;
    const newObstacle: Obstacle = {
      id: obstacles.length + 1,
      position: { x, y: 0, z },
      type: Math.random() > 0.5 ? 'rock' : 'wall',
      size: { 
        width: 1 + Math.random() * 2, 
        height: 0.5 + Math.random() * 1, 
        depth: 1 + Math.random() * 2 
      },
      boundingBox: { 
        min: { x: x - 1, y: 0, z: z - 1 }, 
        max: { x: x + 1, y: 1, z: z + 1 } 
      },
      // Add missing required properties
      properties: {
        traversable: false,
        reflectivity: 0.8,
        durability: 1,
        opacity: 1
      },
      discoveredBy: 1,
      confidence: 1,
      lastSeen: Date.now()
    };
    setObstacles([...obstacles, newObstacle]);
  };

  return (
    <div className="page simulation-page" style={{ background: COLORS.background, color: 'white', minHeight: '100vh' }}>
      <div className="page-header" style={{ padding: '2rem', borderBottom: `1px solid ${COLORS.secondary}` }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'white' }}>Mars Rover Swarm Simulation</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#a0aec0' }}>
          Advanced Autonomous Rover System with Mesh Network Communication
        </p>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Left Panel */}
        <div style={{ width: '350px', padding: '1rem', background: COLORS.primary, overflowY: 'auto' }}>
          <ControlPanel
            rovers={rovers}
            simulationState={simulationState}
            controlState={controlState}
            onSimulationStateChange={setSimulationState}
            onControlStateChange={setControlState}
            onAddRover={addRover}
            onAddObstacle={addRandomObstacle}
            onSelectRover={setSelectedRover}
            selectedRover={selectedRover}
            onLeaderChange={setLeaderId}
            leaderId={leaderId}
            onImaginaryRoverToggle={setImaginaryRoverActive}
            imaginaryRoverActive={imaginaryRoverActive}
            onGestureControlToggle={setGestureControlActive}
            gestureControlActive={gestureControlActive}
            obstacles={obstacles}
            meshNodes={meshNodes}
          />
        </div>

        {/* Main Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Canvas shadows>
            <SimulationScene
              rovers={rovers}
              setRovers={setRovers}
              simulationState={simulationState}
              controlState={controlState}
              obstacles={obstacles}
              meshNodes={meshNodes}
              leaderId={leaderId}
            />
          </Canvas>
        </div>

        {/* Right Panel */}
        <div style={{ width: '350px', padding: '1rem', background: COLORS.primary, overflowY: 'auto' }}>
          <RoverDetails 
            rover={selectedRover}
            simulationState={simulationState}
            onRoverUpdate={(updatedRover) => {
              const updatedRovers = rovers.map(r => 
                r.id === updatedRover.id ? updatedRover : r
              );
              setRovers(updatedRovers);
            }}
            obstacles={obstacles}
            meshNodes={meshNodes}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulatPage;
const SimulatorPage: React.FC = () => {
  // Similar to original Simulation, but add notes
  return (
    <div className="page">
      <h1>Simulator</h1>
      <p>Separate port, emulates rovers, leaders, RSSI, packet loss. MAC prefix for simulated units.</p>
      {/* Embed enhanced simulation canvas here */}
      <div className="simulation-canvas">
        {/* Original simulation code */}
      </div>
      <p>Controls: Add/remove rovers, obstacles, simulate churn.</p>
    </div>
  );
};

export default SimulatorPage;