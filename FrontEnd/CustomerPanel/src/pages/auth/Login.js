import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
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




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/CustomerUser/CustomerLogin', formData);
      if (response.data.status === true) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user_id', response.data.data.user_id);
        localStorage.setItem('username', response.data.data.username);
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
    catch (error) {
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
    <Container fluid className="login-container">
      <div className="login-overlay"></div>
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card className="login-card">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <i className="fas fa-book-reader fa-3x text-primary mb-3"></i>
              <h2 className="login-title">Library Customer System</h2>
              <p className="text-muted">Welcome back! Please login to your account.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user text-primary"></i>
                  </span>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    autoComplete="off"
                    required
                    className="py-2"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock text-primary"></i>
                  </span>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="off"
                    required
                    className="py-2"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </Form.Group>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              {userbuttoncontrol ? (
                <Button
                  className="w-100 mb-3"
                  variant="secondary"
                  disabled={true}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Login
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-100 login-button py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </Button>
              )
              }

            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default Login; 