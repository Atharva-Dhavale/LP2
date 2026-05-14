import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-brand">
          <Calendar size={28} color="#3b82f6" />
          <span>NexusEvents</span>
        </div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Register
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <Users size={18} />
            Dashboard
          </NavLink>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
