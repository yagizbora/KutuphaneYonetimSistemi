import React, { useState, useEffect } from 'react';
import {
  Button, Menu, MenuItem, Box, Typography, Paper, TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import userService from '../../services/UserService';
import Swal from 'sweetalert2';
import Clock from './Clock';
import Date from './Date';
const userservice = new userService();

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);





  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid',
    boxShadow: 24,
    p: 4,
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout işlemi
  const handleLogout = async () => {
    try {
      const response = await userservice.logout();
      if (response) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error?.response?.message || 'An error occurred while logging out. Please try again.',
        confirmButtonText: 'OK'
      })
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };






  return (
    <div className="topbar">
      <div className="topbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="welcome-text">Welcome to Library Customer System</h1>
          <Date />
        </div>
        <div className="topbar-right">
          <div className="user-profile">
            <Clock />
            <Button
              id="user-profile-button"
              aria-controls="user-profile-menu"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={handleMenuClick}
            >
              User Settings
            </Button>
            <Menu
              id="user-profile-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Topbar;
