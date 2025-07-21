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
import CustomerUserService from '../../../services/CustomerUserService';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { emailValid, validatePhoneNumber } from '../../../utils/helper';
const customerUserService = new CustomerUserService();


const CustomerUserCreate = () => {
    const [formData, setFormData] = useState({

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const createdata = async () => {

        if (!formData.tc_kimlik_no || !formData.username || !formData.password || !formData.name_surname || !formData.birthday_date || !formData.phone_number || !formData.eposta) {
            Swal.fire({
                title: 'Hata',
                text: 'Lütfen tüm alanları doldurun.',
                icon: 'error'
            });
            return;
        }
        if (!emailValid(formData.eposta)) {
            Swal.fire({
                title: 'Hata',
                text: 'Geçerli bir e-posta adresi girin.',
                icon: 'error'
            });
            return;
        }
        if (!validatePhoneNumber(formData.phone_number)) {
            Swal.fire({
                title: 'Hata',
                text: 'Geçerli bir telefon numarası girin.',
                icon: 'error'
            });
            return;
        }
        try {
            const response = await customerUserService.CustomerUserCreate(formData);
            if (response) {
                Swal.fire({
                    title: 'Başarılı',
                    text: response?.data?.message || 'Müşteri kullanıcısı başarıyla oluşturuldu.',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/user';
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
        <>
            <Container>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Müşteri Kullanıcı Ekle
                    </Typography>
                    <Paper sx={{ padding: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                name="tc_kimlik_no"
                                label="T.C. Kimlik No"
                                value={formData.tc_kimlik_no}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="username"
                                label="Kullanıcı Adı"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="password"
                                label="Şifre"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="name_surname"
                                label="Ad Soyad"
                                value={formData.name_surname}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="birthday_date"
                                label="Doğum Tarihi"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={dayjs(formData.birthday_date).format('YYYY-MM-DD')}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="phone_number"
                                label="Telefon Numarası"
                                type="tel"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="eposta"
                                label="E-posta"
                                type="email"
                                value={formData.eposta}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />


                            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={createdata}>
                                Kaydet
                            </Button>
                        </FormControl>
                    </Paper>
                </Box>
            </Container>
        </>
    )
}



export default CustomerUserCreate;