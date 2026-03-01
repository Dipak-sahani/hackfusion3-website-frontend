
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
import MissingMedicines from './pages/MissingMedicines';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import Availability from './components/doctor/Availability';
import Consultation from './components/doctor/Consultation';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect doctors to their dashboard if they try to access admin routes
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" />;
    // Forbidden for others
    return <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-8">
      <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
      <p>Your account ({user.email}) does not have administrative privileges.</p>
      <button onClick={() => window.location.href = '/login'} className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg">Switch Account</button>
    </div>;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<RoleProtectedRoute allowedRoles={['admin']}><Layout /></RoleProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/missing-medicines" element={<MissingMedicines />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/admin-review" element={<ManualReviewPanel />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={['doctor']}><Layout /></RoleProtectedRoute>}>
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

