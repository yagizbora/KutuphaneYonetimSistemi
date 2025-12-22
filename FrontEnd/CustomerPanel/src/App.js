import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Dashboard from './pages/Dashboard';
import CustomerBook from './pages/CustomerBook/CustomerBook';
import Library from './pages/Library/Library';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  if (!token || !user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:44336/api';


function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [version, setVersion] = useState(null);
  const checkversion = async () => {
    try {
      const response = await fetch(`${API_URL}/Version/CheckVersion`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const filterdata = data.map(item => item.app_name === "Customer Panel" ? item : null).filter(item => item !== null)[0];
          setVersion(filterdata.version);
        }
      }
    }
    catch (error) {
      console.error('Error checking version:', error);
    }
  }
  React.useEffect(() => {
    checkversion();
  }, []);
  setInterval(checkversion, 5000);
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
            <Layout isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar} version={version}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customer-book" element={<CustomerBook />} />
                <Route path="/library" element={<Library />} />
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