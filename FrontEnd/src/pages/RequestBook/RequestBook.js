import React, { useState, useEffect } from 'react';
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
    Typography,
    Paper,
    Alert,
    Stack,
    Grid,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RequestService from '../../services/RequestService.js';
import dayjs from 'dayjs';

const requestservice = new RequestService();

const RequestBook = () => {

    const [data, Setdata] = useState()

    const getrequests = async () => {
        try {
            const response = await requestservice.getbookrequest();
            if (response) {
                Setdata(response)
            }
        }
        catch (error) {

        }
    }

    useEffect(() => {
        getrequests();
    }, [])
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
        },
        {
            field: 'book_name',
            headerName: 'Kitap Adı',
            width: 150,
        },
        {
            field: 'request_start_time',
            headerName: 'İstek Başlangıç',
            width: 180,
            type: 'dateTime',
            valueFormatter: (params) => {
                if (!params) return 'Tarih yok';
                const date = dayjs(params.value);
                return date.format('DD.MM.YYYY');
            }
        },
        {
            field: 'request_deadline',
            headerName: 'Son Tarih',
            width: 180,
            type: 'dateTime',
            valueFormatter: (params) => {
                if (!params) return 'Tarih yok';
                const date = dayjs(params.value);
                return date.format('DD.MM.YYYY');
            }
        },
        {
            field: 'comment',
            headerName: 'Yorum',
            width: 200,
        },
        {
            field: 'is_complated',
            headerName: 'Tamamlandı mı?',
            width: 150,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value || false}
                    disabled
                />
            )
        }

    ];

    return (
        <Container spacing={2}>
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kitap İstekleri Listesi
                </Typography>
            </Box>

            <Stack direction="row" justifyContent="center" alignItems="center">
                <Paper elevation={3} sx={{ width: '100%', padding: 2 }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        disableColumnSorting
                    />
                </Paper>
            </Stack>
        </Container>
    )
}


export default RequestBook;