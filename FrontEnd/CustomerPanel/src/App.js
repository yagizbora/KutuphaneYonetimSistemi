import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WelcomeAnimation from './components/layout/WelcomeAnimation';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CustomerBook from './pages/CustomerBook/CustomerBook';
import Library from './pages/Library/Library';
import CustomerEBook from './pages/EBook/CustomerEBook';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  if (!token || !user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44336/api';

function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(() => window.innerWidth >= 900);
  const [version, setVersion] = useState(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 899.98px)');
    const handleMediaChange = (e) => {
      setIsNavbarOpen(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

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
          if (filterdata) {
            setVersion(filterdata.version);
          }
        }
      }
    }
    catch (error) {
      console.error('Error checking version:', error);
    }
  };

  React.useEffect(() => {
    checkversion();
    const intervalId = setInterval(checkversion, 50000);
    return () => clearInterval(intervalId);
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
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
            <WelcomeAnimation />
            <Layout isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar} version={version}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customer-book" element={<CustomerBook />} />
                <Route path="/library" element={<Library />} />
                <Route path="/e-kitap" element={<CustomerEBook />} />
                <Route path="/e-kitap/kitapligim" element={<CustomerEBook />} />
                {/* Add more protected routes here */}
                <Route path="*" element={<NotFound />} />
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
