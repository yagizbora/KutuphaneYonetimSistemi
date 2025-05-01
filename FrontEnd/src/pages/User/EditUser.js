import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
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
import Checkbox from '@mui/material/Checkbox';
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Grid from '@mui/material/Grid';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
const userservice = new UserService();




const edituser = () => {
    const { id } = useParams();
    if (!id) {
        window.history.back();
    }
    const [data, setUsers] = useState({
        "id": 0,
        "username": "",
        "password": "",
        "login_date": '' || null
    });

    useEffect(() => {
        getdata();
    }, []);

    const getdata = async () => {
        try {
            const response = await userservice.getUserById(id);
            if (response) {
                console.log(response.data[0])
                setUsers(response.data[0]);
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


    const edituser = async () => {
        try {
            const response = await userservice.edituser({
                "id": data.id,
                "username": data.username,
                "password": data.password
            });
            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response?.data?.message || 'Kullanıcı başarıyla güncellendi.',
                    icon: 'success'
                }).then(() => {
                    window.history.back();
                });
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


    return (
        <Grid container spacing={2} sx={{ padding: 2 }} flexDirection="column">
            <h5>Edit User</h5>
            <Box>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={data.username ?? ''}
                                    onChange={(e) => setUsers({ ...data, username: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={data.password ?? ''}
                                    onChange={(e) => setUsers({ ...data, password: e.target.value })}
                                />
                            </Grid>
                            {dayjs(data.login_date).isValid() && (
                                <Grid item xs={12} md={6} lg={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Login Date"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            value={dayjs(data.login_date)}
                                            onChange={(e) => setUsers({ ...data, login_date: e?.toISOString?.() || null })}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            )}
                            {data.is_login && (
                                <Grid item xs={12} md={6} lg={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <p style={{ margin: 0 }}>Is Login</p>
                                            <Checkbox
                                                disabled
                                                checked={(data.is_login)}
                                                onChange={(e) =>
                                                    setUsers({ ...data, is_login: e.target.checked })
                                                }
                                            />
                                        </Box>
                                    </FormControl>
                                </Grid>
                            )}

                        </Grid>
                        <Button variant="contained" color="primary" onClick={() => edituser()} sx={{ marginTop: 2 }}>
                            Save Changes
                        </Button>
                    </Paper>
                </Grid>
            </Box>
        </Grid>
    )
}

export default edituser;