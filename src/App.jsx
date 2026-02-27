
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import useAuthStore from './context/useAuthStore';

import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import ManualReviewPanel from './pages/ManualReviewPanel';

import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Logs from './components/Logs';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import Availability from './components/doctor/Availability';
import Consultation from './components/doctor/Consultation';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/logs" element={<Logs />} />

          {/* Doctor Specific Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/manual-review" element={<ManualReviewPanel />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;

