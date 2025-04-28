import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import userService from '../../services/UserService';
import Swal from 'sweetalert2';
const userservice = new userService();


const Topbar = () => {


  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
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
        <h1 className="welcome-text">Welcome to Library System</h1>
        <div className="topbar-right">
          {/* <div className="notifications">
            <i className="fas fa-bell"></i>
          </div> */}
          <div className="user-profile">
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