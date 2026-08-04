import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../utils/axiosConfig';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userbuttoncontrol, setUserbuttoncontrol] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkuserinsystem();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
    if (!token) {
      localStorage.clear();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkuserinsystem = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:44336/api';
      const response = await axios.get(`${API_URL}/auth/User/FirstRegisterController`);
      if (response.data.status === false) {
        Swal.fire({
          title: 'User Not Found',
          text: response.data.message || 'The user does not exist in the system. Please register first.',
          icon: 'warning',
        });
        setUserbuttoncontrol(true);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/User/Login', formData);
      if (response.data.status === true) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user_id', response.data.data.user_id);
        localStorage.setItem('username', response.data.data.username);
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <i className="fas fa-layer-group"></i>
          Library System
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Welcome back! Please login to your admin account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              <i className="fas fa-user text-primary"></i>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="off"
              required
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <label className="form-label">
              <i className="fas fa-lock text-primary"></i>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="off"
                required
                className="form-control"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {userbuttoncontrol ? (
            <button
              className="btn btn-primary login-button w-100"
              style={{ background: 'var(--text-muted)', cursor: 'not-allowed' }}
              disabled
            >
              <i className="fas fa-user-plus me-2"></i>
              Login Disabled
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary login-button w-100"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
