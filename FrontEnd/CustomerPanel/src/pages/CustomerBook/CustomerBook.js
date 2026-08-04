import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomerBookService from '../../services/CustomerBookService';
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
    }

    useEffect(() => {
        getdata();
    }, []);

    const columns = [
        { field: 'id', headerName: t('id'), width: 90 },
        { field: 'kitap_adi', headerName: t('book_name'), width: 200 },
        { field: 'author_name', headerName: t('author'), width: 180 },
        { field: 'library_name', headerName: t('library'), width: 200 },
        { field: 'location', headerName: t('location'), width: 250 },
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
            width: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={1}>
                        <Button
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
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        {t('book_list')}
                    </Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
        </>
    )
}


export default CustomerBook;