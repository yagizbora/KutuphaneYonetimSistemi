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
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const customerBookService = new CustomerBookService();

const Dashboard = () => {
  const { t } = useTranslation();
  const [customerBooks, setCustomerBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const getdata = async () => {
    try {
      setHasError(false);
      const response = await customerBookService.Mybooks();
      const data = response.data.data;
      setCustomerBooks(data);

      if (data.length === 0) {
        setMessage(response.data.message || '');
      }
    } catch (error) {
      console.error('Error fetching customer books:', error);
      setHasError(true);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const columns = [
    { field: 'id', headerName: t('id'), width: 70 },
    { field: 'kitap_adi', headerName: t('book_name'), minWidth: 180, flex: 1 },
    { field: 'author_name', headerName: t('author'), minWidth: 140, flex: 1 },
    { field: 'library_name', headerName: t('library'), minWidth: 140, flex: 1 },
    { field: 'location', headerName: t('location'), minWidth: 140, flex: 1 },
    {
      field: 'odunc_alma_tarihi',
      headerName: t('lending_date'),
      width: 145,
      valueFormatter: (params) => {
        if (!params) return '';
        return dayjs(params).format('DD/MM/YYYY');
      },
    },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '75vh', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/library_background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <Container maxWidth="lg" sx={{ mt: { xs: 1, sm: 3 }, mb: { xs: 2, sm: 4 }, pt: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1E3A8A',
            mb: { xs: 2, sm: 3 },
            textAlign: 'left',
          }}
        >
          {t('dashboard')}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            width: '100%',
            minWidth: 0,
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
            {t('borrowed_books')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ width: '100%', minWidth: 0 }}>
            {customerBooks.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Alert
                  severity="info"
                  sx={{
                    width: { xs: '100%', sm: '70%' },
                    textAlign: 'center',
                    backgroundColor: '#E3F2FD',
                    borderRadius: 2,
                  }}
                >
                  {hasError ? t('error_fetching') : (message || t('no_data'))}
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
    </div>
  );
};

export default Dashboard;
