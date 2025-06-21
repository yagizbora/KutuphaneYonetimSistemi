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
const userservice = new userService();

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userchangemodal, setUserChangeModal] = useState(false);
  const [userchangepasswordmodal, setUserChangePasswordModal] = useState(false);
  const openuserchangepasswordmodal = () => {
    setPassword({
      password: "",
      confirmpassword: ""
    });
    setUserChangePasswordModal(true)


  }
  const [username, setUsername] = useState({
    username: "",
    confirmusername: ""
  });
  const [password, setPassword] = useState({
    password: "",
    confirmpassword: ""
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

  const handlechangeusername = async () => {


    if (username.username.trim() !== username.confirmusername.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Username uyuşmazlığı',
        text: 'Yeni kullanıcı adınız ile onayladığınız kullanıcı adı uyuşmuyor.',
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
      return;
    }

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
      const payload = { username: username.username.trim() };

      const response = await userservice.changeusername(payload);

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
        text: error?.response?.data?.message || `An error occurred while changing username. Please try again. ${error}`,
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
    }
  };


  const handlechangepassword = async () => {
    if (password.password === '') {
      setUserChangePasswordModal(false)
      Swal.fire({
        icon: 'error',
        title: 'Please enter a new password.',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (password.password !== password.confirmpassword) {
      setUserChangePasswordModal(false)
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match.',
        confirmButtonText: 'OK'
      });
      return;
    }
    try {
      const payload = { username: username.username, password: password.password };
      const response = await userservice.changepassword(payload)
      if (response.status === 200 || response) {
        setUserChangePasswordModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Password Changed Successfully!' || response.data.message,
          text: response.data.message,
          confirmButtonText: 'OK'
        }).then(() => {
          localStorage.clear();
          window.location.href = '/login';
        });
      }

    }
    catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Change Password Failed',
        text: error?.response?.data?.message || 'An error occurred while changing password. Please try again.',
        confirmButtonText: 'OK'
      });
      setUserChangeModal(false);
    }
  }

  return (
    <div className="topbar">
      <div className="topbar-container">
        <h1 className="welcome-text">Welcome to Library System</h1>
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
              <MenuItem onClick={() => setUserChangeModal(true)}>Change Username</MenuItem>
              <MenuItem onClick={() => openuserchangepasswordmodal()}>Change Password</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <Modal
        open={userchangemodal}
        onClose={() => setUserChangeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="md"
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button variant="contained" onClick={handlechangeusername}>Change Username</Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
      <Dialog
        open={userchangepasswordmodal}
        onClose={() => setUserChangePasswordModal(false)}
      >
        <DialogTitle> Change Password </DialogTitle>
        <DialogContent>
          <p>Enter your new password:</p>
          <TextField
            variant="outlined"
            fullWidth
            onChange={(e) => setPassword({ ...password, password: e.target.value })}
            value={password.password}
          />

          <p>Enter your new password:</p>
          <TextField
            variant="outlined"
            fullWidth
            onChange={(e) => setPassword({ ...password, confirmpassword: e.target.value })}
            value={password.confirmpassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlechangepassword()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Topbar;
