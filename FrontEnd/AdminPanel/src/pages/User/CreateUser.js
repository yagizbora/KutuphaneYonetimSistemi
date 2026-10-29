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
    InputLabel
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import BookService from '../../services/BookService';
import LendingBookService from '../../services/LendingBook';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import UserService from '../../services/UserService';

import './CreateUser.css';

const userService = new UserService();

const CreateUser = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    const createuser = async () => {
        try {
            if (!user.username || !user.password) {
                Swal.fire({
                    title: 'Hata',
                    text: 'Kullanıcı adı ve şifre boş olamaz.',
                    icon: 'error'
                });
                return;
            }
            const response = await userService.createuser(user);
            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response.message || 'Kullanıcı başarıyla oluşturuldu.',
                    icon: 'success'
                });
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Kullanıcı oluşturulurken bir hata oluştu.',
                icon: 'error'
            });
        }
    }

    return (
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Box>
                <Typography variant="h5" sx={{ marginBottom: 2, display: 'flex' }}>
                    Kullanıcı Ekle
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                <FormControl className="textField" fullWidth variant="outlined">
                    <TextField
                        fullWidth
                        label="Kullanıcı Adı"
                        variant="outlined"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined">
                    <TextField
                        fullWidth
                        label="Şifre"
                        variant="outlined"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </FormControl>
            </Box>
            <Grid item xs={12} md={6}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={createuser}
                    sx={{ mt: 1, width: { xs: '100%', sm: '200px' } }}
                    className="createUserButton"
                >
                    Kullanıcı Ekle
                </Button>
            </Grid>
        </Container>
    )
}

export default CreateUser;
