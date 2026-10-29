import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    Stack
} from '@mui/material';
import Swal from 'sweetalert2';
import CustomerBookRequestService from '../../services/CustomerBookRequestService';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const customerbookrequestservice = new CustomerBookRequestService();

const CustomerBooKRequest = () => {
    const { t } = useTranslation();
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
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
                icon: 'error'
            });
        }
    }

    const handleCustomerRequestResult = async (data) => {
        const payload = {
            "book_id": data.book_id,
            "result": data.result,
            "request_id": data.id,
            "customer_id": data.customer_user_id
        }
        console.log(payload);
        try {
            const response = await customerbookrequestservice.CustomerRequestResult(payload);
            if (response) {
                Swal.fire({
                    title: t('success'),
                    text: t('operation_successful'),
                    icon: 'success'
                });
                getdata();
            }
        }
        catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
                icon: 'error'
            });
        }
    }


    const columns = [
        { field: 'name_surname', headerName: t('customer_name'), minWidth: 160, flex: 1 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 160, flex: 1 },
        { field: 'library_name', headerName: t('library'), minWidth: 160, flex: 1 },
        {
            field: 'request_date',
            headerName: t('request_date'),
            width: 140,
            valueGetter: (params) => dayjs(params.request_date).format('YYYY-MM-DD')
        },
        {
            field: 'operations',
            headerName: t('operations'),
            width: 220,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleCustomerRequestResult({ ...params.row, result: true })}
                    >
                        {t('approve')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleCustomerRequestResult({ ...params.row, result: false })}
                    >
                        {t('reject')}
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <>
            <Container sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                <Box my={3}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>
                        {t('customer_requests')}
                    </Typography>
                    <Paper sx={{ width: '100%', minWidth: 0, p: { xs: 1, sm: 2 } }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            autoHeight
                            disableSelectionOnClick
                            disableColumnSorting
                        />
                    </Paper>
                </Box>
            </Container>
        </>
    )
}

export default CustomerBooKRequest;
