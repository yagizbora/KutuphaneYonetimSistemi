import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Dashboard from './pages/Dashboard';
import CustomerBook from './pages/CustomerBook/CustomerBook';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  if (!token || !user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          localStorage.getItem('token')
            ? <Navigate to="/" replace />
            : <Login />
        } />
        <Route path="/404" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />


        {/* Protected routes */}
        <Route path="/*" element={

          <ProtectedRoute>
            <Layout isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customer-book" element={<CustomerBook />} />
                {/* Add more protected routes here */}
                <Route path="*" element={<NotFound />} />
                {/* Redirect to 404 for any unmatched routes */}
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App; 