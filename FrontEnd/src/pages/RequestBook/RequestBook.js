import React, { useState, useEffect, Suspense } from 'react';
import {
    Container,
    FormControlLabel,
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
    IconButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RequestService from '../../services/RequestService.js';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const requestservice = new RequestService();

const RequestBook = () => {

    const [data, Setdata] = useState()
    const [createRequest, setCreateRequest] = useState({
        book_name: '',
        request_start_time: '',
        request_deadline: '',
        comment: '',
        is_complated: false,
    });




    var columns = [
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
        },
        {
            field: 'operations',
            headerName: 'Operasyonlar',
            width: 350,
            renderCell: (params) => (
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton color="error" onClick={() => handledeleterequest(params)}>
                        <DeleteOutlineIcon />
                    </IconButton>

                    <Stack direction="column" spacing={1} alignItems="flex-start">
                        <p style={{ margin: 0 }}>Durum Değiştirme!</p>

                        <Switch
                            checked={params.row.is_complated}
                            onChange={async (e) => {
                                const newValue = e.target.checked;

                                try {
                                    // Backend'e istek at
                                    await iscomplatedrequest(params, newValue);

                                    // ResizeObserver hatasını önlemek için requestAnimationFrame kullan
                                    requestAnimationFrame(() => {
                                        Setdata((prevData) =>
                                            prevData.map((row) =>
                                                row.id === params.row.id
                                                    ? { ...row, is_complated: newValue }
                                                    : row
                                            )
                                        );
                                    });
                                } catch (error) {
                                    console.error("Durum güncelleme hatası:", error);
                                }
                            }}
                        />
                    </Stack>
                </Stack>
            )
        }

    ];

    const iscomplatedrequest = async (data, switchvalue) => {
        try {
            const response = await requestservice.complatedbookrequest({
                id: data.id,
                is_complated: switchvalue
            });
            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response.data.message,
                    icon: 'success',
                    showConfirmButton: true,
                }).then(() => {

                    setTimeout(() => getrequests(), 0);
                });

            }
        }
        catch (error) {

        }
    }
    const getrequests = async () => {
        try {
            const response = await requestservice.getbookrequest();
            if (response) {
                Setdata(response);
            }
        } catch (error) {
            console.error("An error occurred while fetching book requests:", error);
        }
    };

    const handledeleterequest = async (data) => {
        try {
            Swal.fire({
                icon: "question",
                title: 'Silmek istediğinize emin misiniz?',
                text: "Bu işlem geri alınamaz!",
                showCancelButton: true,
                confirmButtonText: "Evet, sil",
                cancelButtonText: "Hayır",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await requestservice.deletebookrequest(data);
                    if (response) {
                        Swal.fire({
                            title: 'Başarılı',
                            text: response.data.message,
                            icon: 'success',
                            showConfirmButton: true,
                        }).then(() => {
                            getrequests();
                        })
                    }
                }
            })
        }
        catch (error) {
            console.error(error)
        }

    }




    const createrequest = async () => {
        try {
            const response = await requestservice.createbookrequest(createRequest);

            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response.data.message,
                    icon: 'success',
                    showConfirmButton: true,
                });
                getrequests();
                setCreateRequest({
                    book_name: '',
                    request_start_time: '',
                    request_deadline: '',
                    comment: '',
                    is_complated: false,
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getrequests();
    }, [])

    return (
        <Container spacing={2}>
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kitap İstekleri Listesi
                </Typography>
            </Box>


            <Stack direction="row" justifyContent="center" alignItems="center">
                <Box width="100%" sx={{ overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{ width: '100%', padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Book Name"
                                    value={createRequest.book_name}
                                    onChange={(e) => setCreateRequest(prev => ({ ...prev, book_name: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Comment"
                                    value={createRequest.comment}
                                    onChange={(e) => setCreateRequest(prev => ({ ...prev, comment: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Request Start Time"
                                    InputLabelProps={{ shrink: true }}
                                    value={createRequest.request_start_time}
                                    onChange={(e) => setCreateRequest(prev => ({ ...prev, request_start_time: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Request Deadline"
                                    InputLabelProps={{ shrink: true }}
                                    value={createRequest.request_deadline}
                                    onChange={(e) => setCreateRequest(prev => ({ ...prev, request_deadline: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={createRequest.is_complated}
                                            onChange={(e) => setCreateRequest(prev => ({ ...prev, is_complated: e.target.checked }))}
                                        />
                                    }
                                    label="Is Completed"
                                />
                            </Grid>
                            <Button variant="contained" onClick={() => createrequest()}>Create Request</Button>
                        </Grid>
                    </Paper>
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center">
                <Paper elevation={3} sx={{ width: '100%', padding: 2 }}>

                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        getRowHeight={() => 'auto'}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        disableColumnSorting
                    // isRowSelectable={false}
                    />


                </Paper>
            </Stack>
        </Container>
    )
}


export default RequestBook;