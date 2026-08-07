import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import darkTheme from './theme/darkTheme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NetworkGraphPage from './pages/NetworkGraphPage';
import InvestigationPage from './pages/InvestigationPage';
import AppealsPage from './pages/AppealsPage';
import AuditLedgerPage from './pages/AuditLedgerPage';
import SimulationPage from './pages/SimulationPage';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Layout Wrapper
const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0b0f19' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#0b0f19', minHeight: 'calc(100vh - 65px)' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/graph"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NetworkGraphPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investigate"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <InvestigationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appeals"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppealsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AuditLedgerPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SimulationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
