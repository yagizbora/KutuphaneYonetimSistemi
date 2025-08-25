import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Checkbox,
    Table,
    Tabs,
    Tab,
    TableHead,
    TableRow,
    TableCell,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import Swal from 'sweetalert2';
import CustomerBookRequestService from '../../services/CustomerBookRequestService';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const customerbookrequestservice = new CustomerBookRequestService();

const CustomerBooKRequest = () => {
    const [data, setCustomerBookRequests] = useState([]);

    useEffect(() => {
        getdata();
    }, []);

    const getdata = async () => {
        try {
            const response = await customerbookrequestservice.ListCustomerBookRequests();
            if (response) {
                setCustomerBookRequests(response.data.data);
                console.log(response.data.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error'
            });
        }
    }

    const columns = [
        { field: 'name_surname', headerName: 'Müşteri Adı', width: 200 },
        { field: 'kitap_adi', headerName: 'Kitap Adı', width: 200 },
        { field: 'library_name', headerName: 'Kütüphane', width: 200 },
        {
            field: 'request_date',
            headerName: 'İstek Tarihi',
            width: 200,
            valueGetter: (params) => dayjs(params.request_date).format('YYYY-MM-DD')
        },
    ];

    return (
        <>
            <Container>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Müşteri Kitap İstekleri
                    </Typography>
                    <Paper>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            disableSelectionOnClick
                            disableColumnSorting
                        >

                        </DataGrid>

                    </Paper>
                </Box>
            </Container>
        </>
    )
}

export default CustomerBooKRequest;