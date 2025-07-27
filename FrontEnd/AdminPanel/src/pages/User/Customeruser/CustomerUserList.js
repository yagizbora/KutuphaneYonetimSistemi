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
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import CustomerUserService from "../../../services/CustomerUserService";

const customerUserService = new CustomerUserService();




const CustomerUserList = () => {
    const [data, setCustomerUsers] = useState({});
    const [editdata, setEditData] = useState({});
    const [editdataOpen, setEditDataOpen] = useState(false);


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'tc_kimlik_no', headerName: 'T.C. Kimlik No', width: 150 },
        { field: 'username', headerName: 'Kullanıcı Adı', width: 150 },
        { field: 'name_surname', headerName: 'Ad Soyad', width: 200 },
        {
            field: 'birthday_date', headerName: 'Doğum Tarihi', width: 180, type: 'Date',
            valueGetter: (params) => dayjs(params.value).format('DD/MM/YYYY')
        },
        {
            field: 'phone_number', headerName: 'Telefon', width: 150,
            renderCell: (params) => (
                <>
                    {params.row.phone_number ? (
                        <a href={`tel: +90${params.row.phone_number}`} rel="noopener noreferrer">
                            +90{params.row.phone_number}
                        </a>
                    ) : null}
                </>
            )
        },
        { field: 'eposta', headerName: 'E-posta', width: 200 },
        {
            field: '', headerName: 'İşlemler', width: 150, renderCell: (params) => (
                <>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        <Button onClick={() => ListCustomerUsersbyid(params.row.id)} variant="contained" color="primary">
                            Düzenle
                        </Button>
                    </Stack>
                </>
            )
        }
    ];


    useEffect(() => {
        ListCustomerUsers();
    }, []);


    const ListCustomerUsers = async () => {
        try {
            const response = await customerUserService.ListCustomerUsers();
            if (response) {
                setCustomerUsers(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Müşteri kullanıcılar yüklenirken bir hata oluştu.',
                icon: 'error'
            });
        }
    }

    const ListCustomerUsersbyid = async (data) => {
        try {
            const response = await customerUserService.ListCustomerUsersbyid(data);
            if (response) {
                setEditData(response.data[0]);
                setEditDataOpen(true);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Müşteri kullanıcılar yüklenirken bir hata oluştu.',
                icon: 'error'
            });
        }
    }

    const editCustomerUser = async () => {
        try {
            const response = await customerUserService.editCustomerUser(editdata);
            if (response && response.data.statusCode === 200) {
                Swal.fire({
                    title: 'Başarılı',
                    text: 'Müşteri kullanıcısı başarıyla düzenlendi.',
                    icon: 'success'
                });
                setEditDataOpen(false);
                ListCustomerUsers();
            }
            else if (response && response.data.statusCode === 400) {
                Swal.fire({
                    title: 'Hata',
                    text: response.data.message || 'Müşteri kullanıcısı düzenlenirken bir hata oluştu.',
                    icon: 'error'
                });
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Müşteri kullanıcısı düzenlenirken bir hata oluştu.',
                icon: 'error'
            });
        }

    }


    return (
        <>
            <Container>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Müşteri Kullanıcı Listesi
                    </Typography>
                </Box>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        components={{ Toolbar: GridToolbar }}
                    />
                </Paper>
                {editdataOpen && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Kullanıcıyı Düzenle
                        </Typography>
                        <Paper sx={{ padding: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Ad Soyad"
                                        fullWidth
                                        value={editdata.name_surname || ''}
                                        onChange={(e) => setEditData({ ...editdata, name_surname: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="T.C. Kimlik No"
                                        fullWidth
                                        value={editdata.tc_kimlik_no || ''}
                                        onChange={(e) => setEditData({ ...editdata, tc_kimlik_no: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Kullanıcı Adı"
                                        fullWidth
                                        value={editdata.username || ''}
                                        onChange={(e) => setEditData({ ...editdata, username: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Telefon"
                                        fullWidth
                                        value={editdata.phone_number || ''}
                                        onChange={(e) => setEditData({ ...editdata, phone_number: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="E-posta"
                                        fullWidth
                                        value={editdata.eposta || ''}
                                        onChange={(e) => setEditData({ ...editdata, eposta: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                                        <DatePicker
                                            label="Doğum Tarihi"
                                            format="DD/MM/YYYY"
                                            value={editdata.birthday_date ? dayjs(editdata.birthday_date) : null}
                                            onChange={(date) =>
                                                setEditData({ ...editdata, birthday_date: date ? date.toISOString() : null })
                                            }
                                            slotProps={{
                                                textField: { fullWidth: true },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="contained" color="primary" onClick={editCustomerUser}>
                                            Kaydet
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => setEditDataOpen(false)}>
                                            İptal
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                )}

            </Container>
        </>
    )
}


export default CustomerUserList;