import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Checkbox,
    Table,
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
    Stack,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

const userservice = new UserService();





const user = () => {

    const [data, setUsers] = useState([]);

    useEffect(() => {
        listallusers();
    }, []);

    const listallusers = async () => {
        try {
            const response = await userservice.getUsers();
            if (response) {
                setUsers(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu.',
                icon: 'error'
            })
        }
    }

    const handledelete = async (data) => {
        try {
            const response = await userservice.deleteuser(data);

            if (response?.statusCode === 200 && response?.status === true) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response.message || 'Kullanıcı başarıyla silindi.',
                    icon: 'success'
                });
                await listallusers();
            } else {
                Swal.fire({
                    title: 'Hata',
                    text: response.message || 'Kullanıcı silinemedi.',
                    icon: 'error'
                });
            }
        } catch (error) {

            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu.',
                icon: 'error'
            });
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Kullanıcı adı', width: 150 },
        {
            field: 'login_date', headerName: 'Giriş Tarihi', width: 150,


            type: 'dateTime', valueFormatter: (params) => {
                if (!params) {
                    return 'Giriş yapılmadı';

                }
                return dayjs(params).format('DD/MM/YYYY HH:mm:ss');
            }
        },
        {
            field: 'is_login', headerName: 'Login', width: 150, type: 'bool', renderCell: (params) => (
                <Checkbox
                    checked={params.value || false}
                    disabled
                />
            )
        },
        {
            field: 'actions', headerName: 'İşlemler', width: 75, flex: 1, renderCell: (params) => (

                <Box spacing={1} gap={1} sx={{ display: 'flex' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => Swal.fire({
                            Title: 'Sil',
                            text: 'Kullanıcıyı silmek istediğinize emin misiniz?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Evet',
                            cancelButtonText: 'Hayır',
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handledelete(params.row);

                            }
                        })}
                    >
                        Kullanıcı Sil
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`/user/edit-user/${params.row.id}`}
                        disabled={(localStorage.getItem('user_id') == params.row.id)}
                    >
                        Kullanıcıyı düzenle
                    </Button>
                </Box>
            )
        },
    ]

    return (
        <Container maxWidth="xl">
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" sx={{ marginBottom: 2, justifyContent: 'center', display: 'flex' }}>
                    Kullanıcılar
                </Typography>
            </Box>
            <Box spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, bgcolor: '#cfe8fc' }}>
                <Button variant="contained" color="primary" href="/user/create">
                    Kullanıcı Ekle
                </Button>

                <Button variant="contained" color="primary" href="/user/customer-user-create">
                    Müşteri Kullanıcı Ekle
                </Button>
            </Box>
            <Stack>
                <Paper sx={{ width: '100%', mb: 4, p: 2 }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        disableColumnSorting
                        components={{
                            Toolbar: GridToolbar
                        }}
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >

                    </DataGrid>
                </Paper>
            </Stack>
        </Container>

    );

}



export default user;