import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    Stack,
    Chip
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import EBookService from '../../services/EBookService';

const ebookService = new EBookService();

const EBookRequest = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await ebookService.getAdminRequestList();
            if (Array.isArray(response?.data)) {
                setRequests(response.data);
            } else {
                setRequests([]);
            }
        } catch (error) {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (row, result) => {
        try {
            const response = await ebookService.submitAdminRequestResult({
                request_id: row.id,
                result
            });
            Swal.fire({
                title: t('success'),
                text: response?.message || t('operation_successful'),
                icon: 'success'
            });
            await fetchRequests();
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
                icon: 'error'
            });
        }
    };

    const handleRevoke = async (row) => {
        try {
            const response = await ebookService.revokeAccess(row.id);
            Swal.fire({
                title: t('success'),
                text: response?.message || t('operation_successful'),
                icon: 'success'
            });
            await fetchRequests();
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
                icon: 'error'
            });
        }
    };

    const pendingRows = requests.filter((r) => r.request_status === true);
    const processedRows = requests.filter((r) => r.request_status === false);

    const pendingColumns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name_surname', headerName: t('customer_name'), minWidth: 180, flex: 1 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 200, flex: 1 },
        { field: 'library_name', headerName: t('library'), width: 160 },
        {
            field: 'file_format',
            headerName: t('format'),
            width: 100,
            renderCell: (params) => <Chip label={params.value || 'PDF'} size="small" variant="outlined" />
        },
        {
            field: 'request_date',
            headerName: t('request_date'),
            width: 160,
            valueFormatter: (params) => (params ? dayjs(params).format('DD/MM/YYYY HH:mm') : '-')
        },
        {
            field: 'operations',
            headerName: t('operations'),
            width: 220,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleDecision(params.row, true)}
                    >
                        {t('approve')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDecision(params.row, false)}
                    >
                        {t('reject')}
                    </Button>
                </Stack>
            )
        }
    ];

    const processedColumns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name_surname', headerName: t('customer_name'), minWidth: 180, flex: 1 },
        { field: 'kitap_adi', headerName: t('book_name'), minWidth: 200, flex: 1 },
        { field: 'library_name', headerName: t('library'), width: 150 },
        {
            field: 'is_approved',
            headerName: t('status'),
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value ? t('approved') : t('rejected')}
                    color={params.value ? 'success' : 'error'}
                    size="small"
                />
            )
        },
        {
            field: 'request_date',
            headerName: t('request_date'),
            width: 155,
            valueFormatter: (params) => (params ? dayjs(params).format('DD/MM/YYYY HH:mm') : '-')
        },
        {
            field: 'response_date',
            headerName: t('response_date'),
            width: 155,
            valueFormatter: (params) => (params ? dayjs(params).format('DD/MM/YYYY HH:mm') : '-')
        },
        {
            field: 'operations',
            headerName: t('operations'),
            width: 180,
            sortable: false,
            renderCell: (params) =>
                params.row.is_approved ? (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRevoke(params.row)}
                    >
                        {t('revoke_access')}
                    </Button>
                ) : null
        }
    ];

    return (
        <Container maxWidth="xl">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('customer_ebook_requests')}
                </Typography>

                <Paper sx={{ mb: 2 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        <Tab label={`${t('active_requests')} (${pendingRows.length})`} />
                        <Tab label={`${t('completed_requests')} (${processedRows.length})`} />
                    </Tabs>
                </Paper>

                <Paper sx={{ p: { xs: 1, sm: 2 }, width: '100%', minWidth: 0 }}>
                    <Box sx={{ height: { xs: 450, md: 550 }, width: '100%', minWidth: 0 }}>
                        <DataGrid
                            rows={tab === 0 ? pendingRows : processedRows}
                            columns={tab === 0 ? pendingColumns : processedColumns}
                            loading={loading}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                            components={{ Toolbar: GridToolbar }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default EBookRequest;
