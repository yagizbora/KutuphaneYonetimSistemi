import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Paper,
    Tabs,
    Tab,
    Typography,
    Box,
    Checkbox,
    IconButton,
    Stack,
    Button,
    Grid,
    TextField,
    FormControlLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import RequestService from '../../services/RequestService';

const requestservice = new RequestService();

const RequestBook = () => {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState(0);
    const [data, setData] = useState([]);
    const [createRequest, setCreateRequest] = useState({
        book_name: '',
        request_start_time: '',
        request_deadline: '',
        comment: '',
        is_complated: false,
    });

    const columnsCommon = [
        { field: 'id', headerName: t('id'), width: 70 },
        { field: 'book_name', headerName: t('book_name'), minWidth: 160, flex: 1 },
        {
            field: 'request_start_time',
            headerName: t('request_start_time'),
            width: 160,
            type: 'dateTime',
            valueFormatter: (params) => dayjs(params).format('DD.MM.YYYY')
        },
        {
            field: 'request_deadline',
            headerName: t('deadline'),
            width: 160,
            type: 'dateTime',
            valueFormatter: (params) => dayjs(params).format('DD.MM.YYYY')
        },
        { field: 'comment', headerName: t('comment'), minWidth: 180, flex: 1 },
        {
            field: 'is_complated',
            headerName: t('is_completed'),
            width: 130,
            renderCell: (params) => (
                <Checkbox checked={params.value || false} disabled />
            )
        }
    ];

    const columnsActive = [
        ...columnsCommon,
        {
            field: 'operations',
            headerName: t('operations'),
            width: 280,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton color="error" onClick={() => handleDelete(params.row)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`/request/complate-request/${params.row.id}`}
                    >
                        {t('go_to_completion_page')}
                    </Button>
                </Stack>
            )
        }
    ];

    const columnsCompleted = [
        ...columnsCommon,
        {
            field: 'closed_subject_details',
            headerName: t('closing_note'),
            minWidth: 220,
            flex: 1,
        },
        {
            field: 'operations',
            headerName: t('operations'),
            width: 280,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton color="error" onClick={() => handleDelete(params.row)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`/request/complate-request/${params.row.id}`}
                    >
                        {t('go_to_completion_page')}
                    </Button>
                </Stack>
            )
        }
    ];

    const handleDelete = async (row) => {
        Swal.fire({
            title: t('are_you_sure'),
            text: t('this_action_cannot_be_undone'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('yes_delete_confirm'),
            cancelButtonText: t('cancel')
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await requestservice.deletebookrequest(row);
                if (res) {
                    Swal.fire(t('deleted'), res.data.message, 'success');
                    getRequests(tabIndex);
                }
            }
        });
    };

    const getRequests = async (index) => {
        try {
            let status = null;
            if (index === 0) status = true;
            else if (index === 1) status = false;

            const response = await requestservice.getbookrequest({ status });
            if (response) {
                setData(response);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const createRequestFunc = async () => {
        try {
            const res = await requestservice.createbookrequest(createRequest);
            if (res) {
                Swal.fire(t('success'), res.data.message, 'success');
                setCreateRequest({
                    book_name: '',
                    request_start_time: '',
                    request_deadline: '',
                    comment: '',
                    is_complated: false,
                });
                getRequests(tabIndex);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getRequests(tabIndex);
    }, [tabIndex]);

    return (
        <Container sx={{ px: { xs: 1, sm: 2, md: 3 }, mb: 4 }}>
            <Box my={3}>
                <Typography variant="h4" align="center" sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>{t('book_requests')}</Typography>
            </Box>

            {/* Form */}
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 4, width: '100%', minWidth: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('book_name')}
                            value={createRequest.book_name}
                            onChange={(e) => setCreateRequest(prev => ({ ...prev, book_name: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('comment')}
                            value={createRequest.comment}
                            onChange={(e) => setCreateRequest(prev => ({ ...prev, comment: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('start')}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={createRequest.request_start_time}
                            onChange={(e) => setCreateRequest(prev => ({ ...prev, request_start_time: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('end')}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={createRequest.request_deadline}
                            onChange={(e) => setCreateRequest(prev => ({ ...prev, request_deadline: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={createRequest.is_complated}
                                    onChange={(e) => setCreateRequest(prev => ({ ...prev, is_complated: e.target.checked }))}
                                />
                            }
                            label={t('is_completed')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={createRequestFunc} sx={{ width: { xs: '100%', sm: 'auto' } }}>{t('add')}</Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, width: '100%', minWidth: 0 }}>
                <Tabs
                    value={tabIndex}
                    onChange={(e, newIndex) => setTabIndex(newIndex)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label={t('active_requests')} />
                    <Tab label={t('completed_requests')} />
                </Tabs>

                <Box mt={2} sx={{ width: '100%', minWidth: 0 }}>
                    <DataGrid
                        rows={data}
                        columns={tabIndex === 0 ? columnsActive : columnsCompleted}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        autoHeight
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default RequestBook;
