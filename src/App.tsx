// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Remove: import './App.css'; - Now using modular CSS imports in main.tsx
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Home from './pages/Home';
import Architecture from './pages/Architecture';
import Communication from './pages/Communication';
import Components from './pages/Components';
import Future from './pages/Future';
import Modes from './pages/Modes';
import Sensors from './pages/Sensors';
import Simulation from './pages/Simulation';
import Security from './pages/Security';
import Validation from './pages/Validation';
import Offline from './pages/Offline';
import Roles from './pages/Roles';
import Geometry from './pages/Geometry';
import Fusion from './pages/Fusion';
import Backend from './pages/Backend';
import SimulatorPage from './pages/SimulatorPage';
import Admin from './pages/Admin';
import Flows from './pages/Flows';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/components" element={<Components />} />
            <Route path="/future" element={<Future />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/security" element={<Security />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/geometry" element={<Geometry />} />
            <Route path="/fusion" element={<Fusion />} />
            <Route path="/backend" element={<Backend />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/flows" element={<Flows />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;