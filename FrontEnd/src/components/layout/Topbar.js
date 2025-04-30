import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Box, Typography, Paper, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import userService from '../../services/UserService';
import Swal from 'sweetalert2';
const userservice = new userService();

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userchangemodal, setUserChangeModal] = useState(false);
  const [username, setUsername] = useState({
    username: "",
    confirmusername: ""
  });

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
    border: '2px solid #000',
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

  const handlechangeusername = async () => {
    console.log('username:', username.username);
    console.log('confirmusername:', username.confirmusername);

    // Username mismatch kontrolü
    if (username.username !== username.confirmusername) {
      Swal.fire({
        icon: 'error',
        title: 'Username Mismatch',
        text: 'The new username and confirmation do not match. Please try again.',
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
      return;
    }

    // Boş username kontrolü
    if (username.username === '') {
      Swal.fire({
        icon: 'error',
        title: 'Empty Username',
        text: 'Please enter a new username.',
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
      return;
    }

    try {
      const payload = { username: username.username }; // JSON formatında
      console.log('Gönderilen payload:', payload);

      const response = await userservice.changeusername(payload); // payload'u gönderiyoruz

      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Username Changed Successfully',
          text: response?.data?.message || 'Your username has been changed successfully.',
          confirmButtonText: 'OK'
        });
        setUserChangeModal(false);
        setUsername({ username: '', confirmusername: '' });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Change Username Failed',
        text: error?.response?.data?.message || 'An error occurred while changing username. Please try again.',
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
      console.error('Change username error:', error);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-container">
        <h1 className="welcome-text">Welcome to Library System</h1>
        <div className="topbar-right">
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
              <MenuItem onClick={() => setUserChangeModal(true)}>Change Username</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <Modal
        open={userchangemodal}
        onClose={() => setUserChangeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Username
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <p>Enter your new username:</p>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) => setUsername({ ...username, username: e.target.value })}
                value={username.username}
              />
            </Paper>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <p>Confirm your new username:</p>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) => setUsername({ ...username, confirmusername: e.target.value })}
                value={username.confirmusername}
              />
            </Paper>
            <Button variant="contained" onClick={handlechangeusername}>Change Username</Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Topbar;
