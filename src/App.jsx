import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Splash from './agent/pages/Splash';
import PortalSelector from './pages/PortalSelector';
import AgentLogin from './agent/pages/AgentLogin';
import AgentDashboard from './agent/pages/AgentDashboard';
import Farmers from './agent/pages/Farmers';
import FarmerDetails from './agent/pages/FarmerDetails';
import TankDetails from './agent/pages/TankDetails';
import SiteVisit from './agent/pages/SiteVisit';
import AddTanks from './agent/pages/AddTanks';
import Tests from './agent/pages/Tests';
import Reports from './agent/pages/Reports';
import Profile from './agent/pages/Profile';

// Layout
import Layout from './agent/components/Layout';
import BottomNavigation from './agent/components/BottomNavigation';
import { isAuthenticated } from './agent/utils/agentAuth';

// Incharge
import InchargeLogin from './incharge/pages/InchargeLogin';
import InchargeLayout from './incharge/components/InchargeLayout';
import InchargeRoutes from './incharge/InchargeRoutes';
import { isInchargeAuthenticated } from './incharge/utils/inchargeAuth';

// Admin
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';
import AdminRoutes from './admin/AdminRoutes';
import { isAdminAuthenticated } from './admin/utils/adminAuth';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // If user directly accesses a protected route without being logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const InchargeProtectedRoute = ({ children }) => {
  if (!isInchargeAuthenticated()) {
    return <Navigate to="/incharge-login" replace />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

// Placeholders for remaining bottom nav tabs
const PlaceholderPage = ({ title }) => (
  <div>
    <div className="section-title">
      <h3>{title}</h3>
    </div>
    <div className="card">
      <p>This is the {title} page.</p>
    </div>
  </div>
);

// Mock Data Context
import { MockDataProvider } from './context/MockDataContext';

function App() {
  return (
    <MockDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<PortalSelector />} />
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route path="/incharge-login" element={<InchargeLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminRoutes />
              </AdminLayout>
            </AdminProtectedRoute>
          } />

          {/* Incharge Routes */}
          <Route path="/incharge/*" element={
            <InchargeProtectedRoute>
              <InchargeLayout>
                <InchargeRoutes />
              </InchargeLayout>
            </InchargeProtectedRoute>
          } />
          
          {/* Authenticated Routes wrapped in ProtectedRoute and Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><AgentDashboard /></Layout></ProtectedRoute>} />
          <Route path="/farmers" element={<ProtectedRoute><Layout><Farmers /></Layout></ProtectedRoute>} />
          <Route path="/farmers/:farmerId" element={<ProtectedRoute><Layout><FarmerDetails /></Layout></ProtectedRoute>} />
          <Route path="/tanks/:tankId" element={<ProtectedRoute><Layout><TankDetails /></Layout></ProtectedRoute>} />
          <Route path="/visit/:tankId" element={<ProtectedRoute><Layout><SiteVisit /></Layout></ProtectedRoute>} />
          <Route path="/add-tanks" element={<ProtectedRoute><Layout><AddTanks /></Layout></ProtectedRoute>} />
          
          <Route path="/tests" element={<ProtectedRoute><Layout><Tests /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MockDataProvider>
  );
}

export default App;
