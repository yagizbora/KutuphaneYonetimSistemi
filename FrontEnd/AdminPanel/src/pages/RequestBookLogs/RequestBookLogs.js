import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Typography,
    Paper,
    FormControl,
    Pagination,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Checkbox,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Swal from 'sweetalert2';
import LogService from "../../services/LogService.js";
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const logservice = new LogService();

const RequestBookLogs = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const response = await logservice.RequestBookLogs();
            if (response && Array.isArray(response.data.data)) {
                setData(response.data.data);
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
    useEffect(() => {
        getData();
    }, []);

    const columns = [
        { field: 'id', headerName: t('id'), width: 90 },
        {
            field: 'auth_person', headerName: t('authorized_person'), width: 150,
            valueFormatter: (params) => {
                if (params === null || params === undefined) {
                    return 'N/A';
                }
                return params.auth_person;
            }
        },
        { field: 'kitap_adi', headerName: t('book'), width: 200 },
        {
            field: 'request_date', headerName: t('request_time'), width: 200,
            valueFormatter: (params) => {
                const date = dayjs(params).format('DD/MM/YYYY');
                return date;
            }
        },
        {
            field: 'request_status', headerName: t('operation_status'), width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Checkbox checked={params.value} disabled />
                    </>
                )
            }
        },
        {
            field: 'is_approved',
            headerName: t('is_request_accepted'),
            width: 180,
            renderCell: (params) => {
                const value = params?.value;

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {value === null || value === undefined ? (
                            <span style={{ color: '#9e9e9e', fontStyle: 'italic', fontSize: 12 }}>
                                {t('unknown')}
                            </span>
                        ) : (
                            <Checkbox
                                checked={!!value}
                                disabled
                                size="small"
                            />
                        )}
                    </div>
                );
            }
        }
    ]

    const getExcel = async () => {
        try {
            const response = await logservice.RequestBookLogsExcel();
            if (response && response.data) {
                Swal.fire({
                    title: t('success'),
                    text: t('excel_downloaded_successfully'),
                    icon: 'success'
                });
            }
        }
        catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_downloading_excel'),
                icon: 'error'
            });
        }
    }

    return (
        <>

            <Container>
                <Typography variant="h4" gutterBottom>
                    {t('request_book_logs')}
                </Typography>
                <Paper style={{ height: 600, width: '100%', padding: '20px' }}>
                    <Button startIcon={<OpenInNewIcon />} variant="outlined" color="primary" style={{ marginBottom: '10px' }} onClick={getExcel}>
                        {t('excel')}
                    </Button>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                    />
                </Paper>
            </Container>
        </>
    )
};

export default RequestBookLogs;