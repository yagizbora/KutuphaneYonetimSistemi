import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomerBookService from '../../services/CustomerBookService';
import {
    Container,
    Box,
    Button,
    Typography,
    Paper,
    Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';

const customerBookService = new CustomerBookService();

const CustomerBook = () => {
    const { t } = useTranslation();
    const [customerBooks, setCustomerBooks] = useState([]);

    const getdata = async () => {
        try {
            const response = await customerBookService.getAllCustomerBooks();
            setCustomerBooks(response.data.data);
            console.log("Customer Books:", response.data);
        } catch (error) {
            console.error("Error fetching customer books:", error);
        }
    };

    const requestbook = async (data) => {
        try {
            const response = await customerBookService.customerbookrequest(data);
            if (response.data.status) {
                Swal.fire({
                    title: t('success'),
                    text: t('book_requested'),
                    icon: 'success'
                });
                getdata();
            } else {
                Swal.fire({
                    title: t('error'),
                    text: response.data.message,
                    icon: 'error'
                });
            }
        }
        catch (error) {
            console.error("Error requesting book:", error);
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_requesting_book'),
                icon: 'error'
            });
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const columns = [
        { field: 'id', headerName: t('id'), width: 70 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 180, flex: 1 },
        { field: 'author_name', headerName: t('author'), minWidth: 150, flex: 1 },
        { field: 'library_name', headerName: t('library'), minWidth: 160, flex: 1 },
        { field: 'location', headerName: t('location'), minWidth: 180, flex: 1 },
        {
            field: 'durum',
            headerName: t('status'),
            width: 120,
            renderCell: (params) => (
                params.value ? t('available') : t('unavailable')
            )
        },
        {
            field: 'actions',
            headerName: t('actions'),
            width: 140,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => requestbook({ book_id: params.row.id, library_id: params.row.library_id })}
                        >
                            {t('request')}
                        </Button>
                    </Stack>
                );
            }
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 600 }}>
                    {t('book_list')}
                </Typography>
                <Paper sx={{ width: '100%', minWidth: 0, p: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
                    <DataGrid
                        rows={customerBooks}
                        columns={columns}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        checkboxSelection={false}
                        disableColumnFiltering
                        autoHeight
                        hideFooter
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default CustomerBook;
