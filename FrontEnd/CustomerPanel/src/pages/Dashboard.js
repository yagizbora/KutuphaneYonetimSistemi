import React, { useEffect, useState } from 'react';
import CustomerBookService from '../services/CustomerBookService';
import {
  Container,
  Box,
  Paper,
  Typography,
  Alert,
  Divider
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const customerBookService = new CustomerBookService();

const Dashboard = () => {
  const [customerBooks, setCustomerBooks] = useState([]);
  const [message, setMessage] = useState('');

  const getdata = async () => {
    try {
      const response = await customerBookService.Mybooks();
      const data = response.data.data;
      setCustomerBooks(data);

      if (data.length === 0) {
        setMessage(response.data.message || 'Gösterilecek veri bulunamadı.');
      }
    } catch (error) {
      console.error('Error fetching customer books:', error);
      setMessage('Veri alınırken bir hata oluştu.');
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'kitap_adi', headerName: 'Kitabın Adı', width: 200 },
    { field: 'author_name', headerName: 'Yazar', width: 150 },
    { field: 'library_name', headerName: 'Kütüphane', width: 150 },
    { field: 'location', headerName: 'Lokasyon', width: 150 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#1E3A8A',
          mb: 3,
          textAlign: 'left',
        }}
      >
        Dashboard
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 500,
            color: '#0D47A1',
          }}
        >
          Alınan Kitaplar
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flex: 1 }}>
          {customerBooks.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <Alert
                severity="info"
                sx={{
                  width: '70%',
                  textAlign: 'center',
                  backgroundColor: '#E3F2FD',
                  borderRadius: 2,
                }}
              >
                {message || 'Gösterilecek veri bulunamadı.'}
              </Alert>
            </Box>
          ) : (
            <DataGrid
              rows={customerBooks}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              components={{ Toolbar: GridToolbar }}
              disableColumnFiltering
              disableSelectionOnClick
              disableColumnSorting
              autoHeight
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
