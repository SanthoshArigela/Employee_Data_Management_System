import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './index.css';

// Set default configuration for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true; // IMPORTANT for express-session

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in upon initial load
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setIsAuthenticated(true);
        setUserRole(res.data.role);
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!(isAuthenticated && (userRole === 'admin' || userRole === 'employee')) ? <Login setAuth={setIsAuthenticated} setRole={setUserRole} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && userRole === 'admin' ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/employee" 
          element={isAuthenticated && userRole === 'employee' ? <EmployeeDashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              userRole === 'admin' ? <Navigate to="/admin" /> : 
              userRole === 'employee' ? <Navigate to="/employee" /> :
              <Navigate to="/login" />
            ) : <Navigate to="/login" />
          } 
        />
        {/* Redirect empty path to appropriate dashboard or login */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              userRole === 'admin' ? <Navigate to="/admin" /> : 
              userRole === 'employee' ? <Navigate to="/employee" /> :
              <Navigate to="/login" />
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
