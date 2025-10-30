import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import ControlPanel from '../components/UI/ControlPanel';
import RoverDetails from '../components/UI/RoverDetails';
import { PHYSICS_CONSTANTS } from '../utils/physicsConstants';
import type { Rover, SimulationState, ControlState, Obstacle, MeshNode } from '../types';

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
};

// Simple Rover Component
const SimpleRover: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  isLeader: boolean;
}> = ({ position, rotation, color, isLeader }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Rover Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.3, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-0.4, 0, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color={COLORS.roverWheels} />
      </mesh>
      <mesh position={[0.4, 0, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color={COLORS.roverWheels} />
      </mesh>
      <mesh position={[-0.4, 0, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color={COLORS.roverWheels} />
      </mesh>
      <mesh position={[0.4, 0, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color={COLORS.roverWheels} />
      </mesh>

      {/* Leader Crown */}
      {isLeader && (
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.2, 0.3, 8]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      )}
    </group>
  );
};

// Custom Line component for Three.js
const ThreeLine: React.FC<{
  points: THREE.Vector3[];
  color: string;
}> = ({ points, color }) => {
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
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
};

// Simulation Scene Component
const SimulationScene: React.FC<{
  rovers: Rover[];
  setRovers: (rovers: Rover[]) => void;
  simulationState: SimulationState;
  controlState: ControlState;
  obstacles: Obstacle[];
  meshNodes: MeshNode[];
  leaderId: number;
}> = ({ rovers, setRovers, simulationState, obstacles, leaderId }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Calculate sensor distances
  const calculateSensorDistances = (rover: Rover): {front: number, left: number, right: number, rear: number} => {
    // Simple simulation - just return some values
    return {
      front: 200 + Math.random() * 200,
      left: 150 + Math.random() * 150,
      right: 150 + Math.random() * 150,
      rear: 300 + Math.random() * 100
    };
  };

  useFrame((_, delta) => {
    if (!simulationState.running) return;

    const updatedRovers = rovers.map(rover => {
      // Update sensor data
      const sensorDistances = calculateSensorDistances(rover);
      const updatedRover = {
        ...rover,
        sensorData: {
          ...rover.sensorData,
          ultrasonic: sensorDistances
        }
      };

      // Simple movement for autonomous rovers
      if (rover.mode === 'autonomous') {
        const speed = 0.5;
        const newX = rover.position.x + Math.sin(rover.rotation.y) * speed * delta;
        const newZ = rover.position.z + Math.cos(rover.rotation.y) * speed * delta;
        
        // Basic boundary checking
        if (Math.abs(newX) < 45 && Math.abs(newZ) < 45) {
          updatedRover.position.x = newX;
          updatedRover.position.z = newZ;
        } else {
          // Turn around if near boundary
          updatedRover.rotation.y += Math.PI * delta;
        }

        // Occasional random turns
        if (Math.random() < 0.01) {
          updatedRover.rotation.y += (Math.random() - 0.5) * Math.PI * delta;
        }
      }

      return updatedRover;
    });

    setRovers(updatedRovers);

    // Camera control
    if (cameraRef.current) {
      if (simulationState.cameraMode === 'follow') {
        const rover = updatedRovers.find(r => r.id === leaderId) || updatedRovers[0];
        cameraRef.current.position.set(
          rover.position.x - 8,
          8,
          rover.position.z - 8
        );
        cameraRef.current.lookAt(rover.position.x, 0, rover.position.z);
      } else if (simulationState.cameraMode === 'top') {
        cameraRef.current.position.set(0, 20, 0);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={60} position={[0, 15, 20]} />
      <OrbitControls enabled={simulationState.cameraMode === 'orbit'} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      
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
        <SimpleRover 
          key={rover.id}
          position={[rover.position.x, rover.position.y, rover.position.z]}
          rotation={[0, rover.rotation.y, 0]}
          color={rover.color}
          isLeader={rover.id === leaderId}
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

      {/* Path visualization */}
      {simulationState.showPaths && rovers.map((rover) => (
        <ThreeLine 
          key={`path-${rover.id}`}
          points={rover.path.map(p => new THREE.Vector3(p.x, 0.02, p.z))}
          color={rover.color}
        />
      ))}
    </>
  );
};

const Simulation: React.FC = () => {
  const [rovers, setRovers] = useState<Rover[]>([
    {
      id: 1,
      mac: "84:0D:8E:AA:01",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      status: 'moving',
      battery: 100,
      role: 'scout',
      mode: 'autonomous',
      sensorData: {
        ultrasonic: { front: 400, left: 300, right: 300, rear: 400 },
        imu: { acceleration: { x: 0, y: 0, z: 0 }, gyro: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0 }, temperature: 25 },
        environmental: { temperature: 25, humidity: 50, pressure: 1013 },
        servo: { angle: 90 }
      },
      messages: ['ARS: Exploring area'],
      connected: true,
      color: COLORS.accent,
      wheelSpeeds: { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 },
      path: [{x: 0, z: 0}],
      neighbors: [2],
      cycle_id: 1,
      ts_cycle: 0,
      hash_seq: 1,
      hash: "A1B2C3D4",
      rssi: -60,
      orientation_8: 0,
      sweep: Array(30).fill(400),
    },
    {
      id: 2,
      mac: "84:0D:8E:AA:02", 
      position: { x: 3, y: 0, z: 2 },
      rotation: { x: 0, y: Math.PI/2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      status: 'moving',
      battery: 85,
      role: 'forager',
      mode: 'autonomous',
      sensorData: {
        ultrasonic: { front: 400, left: 300, right: 300, rear: 400 },
        imu: { acceleration: { x: 0, y: 0, z: 0 }, gyro: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0 }, temperature: 25 },
        environmental: { temperature: 25, humidity: 50, pressure: 1013 },
        servo: { angle: 90 }
      },
      messages: ['ARS: Following scout'],
      connected: true,
      color: COLORS.success,
      wheelSpeeds: { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 },
      path: [{x: 3, z: 2}],
      neighbors: [1],
      cycle_id: 1,
      ts_cycle: 0,
      hash_seq: 1,
      hash: "B2C3D4E5",
      rssi: -65,
      orientation_8: 2,
      sweep: Array(30).fill(400),
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
  });

  const [controlState, setControlState] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 1.0,
    emergencyStop: false,
  });

  const [selectedRover, setSelectedRover] = useState<Rover>(rovers[0]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    {
      id: 1,
      position: { x: 5, y: 0, z: 5 },
      type: 'rock',
      size: { width: 2, height: 1, depth: 2 },
      boundingBox: { 
        min: { x: 4, y: 0, z: 4 }, 
        max: { x: 6, y: 1, z: 6 } 
      }
    }
  ]);
  const [leaderId, setLeaderId] = useState<number>(1);

  const meshNodes: MeshNode[] = rovers.map(rover => ({
    id: rover.id,
    position: rover.position,
    neighbors: rover.neighbors,
    role: rover.role,
    signalStrength: -50 - Math.random() * 30,
  }));

  const addRover = (position: { x: number, z: number }) => {
    const newId = Math.max(...rovers.map(r => r.id)) + 1;
    const newRover: Rover = {
      id: newId,
      mac: `84:0D:8E:AA:${newId.toString().padStart(2, '0')}`,
      position: { x: position.x, y: 0, z: position.z },
      rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      status: 'moving',
      battery: 100,
      role: 'scout',
      mode: 'autonomous',
      sensorData: {
        ultrasonic: { front: 400, left: 300, right: 300, rear: 400 },
        imu: { acceleration: { x: 0, y: 0, z: 0 }, gyro: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0 }, temperature: 25 },
        environmental: { temperature: 25, humidity: 50, pressure: 1013 },
        servo: { angle: 90 }
      },
      messages: ['ARS: New rover deployed'],
      connected: true,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      wheelSpeeds: { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 },
      path: [{x: position.x, z: position.z}],
      neighbors: [],
      cycle_id: 1,
      ts_cycle: 0,
      hash_seq: 1,
      hash: "C3D4E5F6",
      rssi: -70,
      orientation_8: 0,
      sweep: Array(30).fill(400),
    };
    setRovers([...rovers, newRover]);
  };

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
      }
    };
    setObstacles([...obstacles, newObstacle]);
  };

  return (
    <div className="page simulation-page">
      <div className="page-header">
        <h1>Mars Rover Swarm Simulation</h1>
        <p className="page-description">
          Advanced Autonomous Rover System with ESP-NOW Mesh Network and HMAC-SHA256 Security
        </p>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: '1rem' }}>
        {/* Left Panel */}
        <div style={{ width: '350px' }}>
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
            onImaginaryRoverToggle={() => {}}
            imaginaryRoverActive={false}
            onGestureControlToggle={() => {}}
            gestureControlActive={false}
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
        <div style={{ width: '350px' }}>
          <RoverDetails 
            rover={selectedRover}
          />
        </div>
      </div>
    </div>
  );
};

export default Simulation;