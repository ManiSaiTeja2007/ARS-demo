// src/components/UI/ControlPanel.tsx
import React from 'react';
import { SimulationState, ControlState, Rover, Obstacle, MeshNode } from '../../types';

interface ControlPanelProps {
  rovers: Rover[];
  simulationState: SimulationState;
  controlState: ControlState;
  onSimulationStateChange: (state: SimulationState) => void;
  onControlStateChange: (state: ControlState) => void;
  onAddRover: (position: { x: number; z: number }) => void;
  onAddObstacle: () => void;
  onSelectRover: (rover: Rover) => void;
  selectedRover: Rover;
  onLeaderChange: (leaderId: number) => void;
  leaderId: number;
  onImaginaryRoverToggle: (active: boolean) => void;
  imaginaryRoverActive: boolean;
  onGestureControlToggle: (active: boolean) => void;
  gestureControlActive: boolean;
  obstacles: Obstacle[];
  meshNodes: MeshNode[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  rovers,
  simulationState,
  controlState,
  onSimulationStateChange,
  onControlStateChange,
  onAddRover,
  onAddObstacle,
  onSelectRover,
  selectedRover,
  onLeaderChange,
  leaderId,
  onImaginaryRoverToggle,
  imaginaryRoverActive,
  onGestureControlToggle,
  gestureControlActive,
  obstacles,
  meshNodes
}) => {
  const handleSimulationToggle = () => {
    onSimulationStateChange({
      ...simulationState,
      running: !simulationState.running
    });
  };

  const handleTimeScaleChange = (scale: number) => {
    onSimulationStateChange({
      ...simulationState,
      timeScale: scale
    });
  };

  const handleCameraModeChange = (mode: 'orbit' | 'follow' | 'top') => {
    onSimulationStateChange({
      ...simulationState,
      cameraMode: mode
    });
  };

  const handleSpeedChange = (speed: number) => {
    onControlStateChange({
      ...controlState,
      speed
    });
  };

  const handleAddRover = () => {
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    onAddRover({ x, z });
  };

  const handleRoverModeChange = (roverId: number, mode: 'manual' | 'autonomous') => {
    const updatedRovers = rovers.map(rover =>
      rover.id === roverId ? { ...rover, mode } : rover
    );
    onSelectRover(updatedRovers.find(r => r.id === roverId) || selectedRover);
  };

  const handleRoverRoleChange = (roverId: number, role: 'leader' | 'scout' | 'relay') => {
    const updatedRovers = rovers.map(rover =>
      rover.id === roverId ? { ...rover, role } : rover
    );
    onSelectRover(updatedRovers.find(r => r.id === roverId) || selectedRover);
  };

  const handleEmergencyStop = () => {
    onControlStateChange({
      ...controlState,
      emergencyStop: true
    });
    
    // Reset all rovers
    const updatedRovers = rovers.map(rover => ({
      ...rover,
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    }));
    
    setTimeout(() => {
      onControlStateChange({
        ...controlState,
        emergencyStop: false
      });
    }, 2000);
  };

  return (
    <div className="control-panel" style={{ 
      background: '#1a365d', 
      color: 'white', 
      padding: '1rem',
      borderRadius: '8px',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Control Panel</h2>

      {/* Simulation Controls */}
      <div className="control-section" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Simulation</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            onClick={handleSimulationToggle}
            style={{
              background: simulationState.running ? '#e53e3e' : '#38a169',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            {simulationState.running ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={handleEmergencyStop}
            style={{
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Emergency Stop
          </button>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Time Scale: {simulationState.timeScale}x</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={simulationState.timeScale}
            onChange={(e) => handleTimeScaleChange(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Speed: {controlState.speed.toFixed(1)} m/s</label>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={controlState.speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Camera Controls */}
      <div className="control-section" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Camera</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['orbit', 'follow', 'top'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleCameraModeChange(mode)}
              style={{
                background: simulationState.cameraMode === mode ? '#3182ce' : '#2d3748',
                color: 'white',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1,
                textTransform: 'capitalize'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="control-section" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Visualization</h3>
        {[
          { key: 'showGrid', label: 'Show Grid' },
          { key: 'showSensors', label: 'Show Sensors' },
          { key: 'showPaths', label: 'Show Paths' },
          { key: 'showMeshNetwork', label: 'Show Mesh Network' },
          { key: 'showCommunicationLines', label: 'Show Comm Lines' }
        ].map(({ key, label }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
            <input
              type="checkbox"
              checked={simulationState[key as keyof SimulationState] as boolean}
              onChange={(e) => onSimulationStateChange({
                ...simulationState,
                [key]: e.target.checked
              })}
              style={{ marginRight: '0.5rem' }}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Rover Management */}
      <div className="control-section" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Rover Management</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            onClick={handleAddRover}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Add Rover
          </button>
          <button
            onClick={onAddObstacle}
            style={{
              background: '#dd6b20',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Add Obstacle
          </button>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Select Leader:</label>
          <select
            value={leaderId}
            onChange={(e) => onLeaderChange(parseInt(e.target.value))}
            style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', background: '#2d3748', color: 'white' }}
          >
            {rovers.map(rover => (
              <option key={rover.id} value={rover.id}>
                Rover {rover.id} ({rover.role})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Active Rovers:</label>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #2d3748', borderRadius: '4px' }}>
            {rovers.map(rover => (
              <div
                key={rover.id}
                onClick={() => onSelectRover(rover)}
                style={{
                  padding: '0.5rem',
                  background: selectedRover.id === rover.id ? '#3182ce' : 'transparent',
                  cursor: 'pointer',
                  borderBottom: '1px solid #2d3748'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>Rover {rover.id}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {rover.role} • {rover.mode} • {rover.battery.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Rover Controls */}
      {selectedRover && (
        <div className="control-section" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Rover {selectedRover.id} Controls</h3>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Mode:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['manual', 'autonomous'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleRoverModeChange(selectedRover.id, mode)}
                  style={{
                    background: selectedRover.mode === mode ? '#3182ce' : '#2d3748',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1,
                    textTransform: 'capitalize'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role:</label>
            <select
              value={selectedRover.role}
              onChange={(e) => handleRoverRoleChange(selectedRover.id, e.target.value as 'leader' | 'scout' | 'relay')}
              style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', background: '#2d3748', color: 'white' }}
            >
              <option value="leader">Leader</option>
              <option value="scout">Scout</option>
              <option value="relay">Relay</option>
            </select>
          </div>
        </div>
      )}

      {/* Experimental Features */}
      <div className="control-section">
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Experimental</h3>
        
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={imaginaryRoverActive}
            onChange={(e) => onImaginaryRoverToggle(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Imaginary Rover
        </label>

        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={gestureControlActive}
            onChange={(e) => onGestureControlToggle(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Gesture Control
        </label>
      </div>

      {/* Stats */}
      <div className="control-section" style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
        <div>Rovers: {rovers.length}</div>
        <div>Obstacles: {obstacles.length}</div>
        <div>Mesh Nodes: {meshNodes.length}</div>
        <div>Connections: {meshNodes.reduce((acc, node) => acc + node.neighbors.length, 0) / 2}</div>
      </div>
    </div>
  );
};

export default ControlPanel;