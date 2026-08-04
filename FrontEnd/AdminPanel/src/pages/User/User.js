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
import { useTranslation } from 'react-i18next';

const userservice = new UserService();

const User = () => {
    const { t } = useTranslation();
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
                title: t('error'),
                text: error?.response?.data?.message || t('error_loading_users'),
                icon: 'error'
            })
        }
    }

    const handledelete = async (data) => {
        try {
            const response = await userservice.deleteuser(data);

            if (response?.statusCode === 200 && response?.status === true) {
                Swal.fire({
                    title: t('success'),
                    text: response.message || t('user_deleted_successfully'),
                    icon: 'success'
                });
                await listallusers();
            } else {
                Swal.fire({
                    title: t('error'),
                    text: response.message || t('user_could_not_be_deleted'),
                    icon: 'error'
                });
            }
        } catch (error) {

            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_deleting_user'),
                icon: 'error'
            });
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: t('user_name'), width: 150 },
        {
            field: 'login_date', headerName: t('login_date'), width: 150,


            type: 'dateTime', valueFormatter: (params) => {
                if (!params) {
                    return t('not_logged_in');

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
            field: 'actions', headerName: t('actions'), width: 75, flex: 1, renderCell: (params) => (

                <Box spacing={1} gap={1} sx={{ display: 'flex' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => Swal.fire({
                            title: t('delete'),
                            text: t('are_you_sure_delete_user'),
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: t('yes'),
                            cancelButtonText: t('no'),
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handledelete(params.row);

                            }
                        })}
                    >
                        {t('delete_user')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`/user/edit-user/${params.row.id}`}
                        disabled={(localStorage.getItem('user_id') == params.row.id)}
                    >
                        {t('edit_user')}
                    </Button>
                </Box>
            )
        },
    ]

    return (
        <Container maxWidth="xl">
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" sx={{ marginBottom: 2, justifyContent: 'center', display: 'flex' }}>
                    {t('users')}
                </Typography>
            </Box>
            <Box spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, bgcolor: '#cfe8fc' }}>
                <Button variant="contained" color="primary" href="/user/create">
                    {t('add_user')}
                </Button>
                <Button variant="contained" color="primary" href="/user/customer-user-list">
                    {t('customer_user_list')}
                </Button>

                <Button variant="contained" color="primary" href="/user/customer-user-create">
                    {t('add_customer_user')}
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

export default User;