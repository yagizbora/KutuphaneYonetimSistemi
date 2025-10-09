import React, { useEffect, useState } from 'react';
import CustomerBookService from '../services/CustomerBookService';
import {
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  FormControlLabel,
  Typography,
  Paper,
  Alert,
  Grid,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
const customerBookService = new CustomerBookService();

const Dashboard = () => {

  const [customerBooks, setCustomerBooks] = useState([]);

  const getdata = async () => {
    try {
      const response = await customerBookService.Mybooks();
      setCustomerBooks(response.data.data);
      console.log("Customer Books:", response.data);
    }
    catch (error) {
      console.error("Error fetching customer books:", error);
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'kitap_adi', headerName: 'Kitabın adı', width: 200 },
    { field: 'author_name', headerName: 'Yazar', width: 150 },
    { field: 'library_name', headerName: 'Kütüphane', width: 150 },
    { field: 'location', headerName: 'Lokasyon', width: 150 },
  ]
  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={customerBooks}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              disableColumnSorting
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard; 