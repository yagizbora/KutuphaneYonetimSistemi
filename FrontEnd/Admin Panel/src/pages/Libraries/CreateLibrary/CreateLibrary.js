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
    TextareaAutosize,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import LibraryService from '../../../services/LibraryService.js';
import { emailValid, validatePhoneNumber } from '../../../utils/helper.js';

const CreateLibrary = ({ refrestdata }) => {
    const libraryService = new LibraryService();
    const [createdata, setCreateData] = useState({})


    const createdatafunction = async () => {
        try {
            if (createdata.library_email && !emailValid(createdata.library_email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Geçersiz E-posta',
                    text: 'Lütfen geçerli bir e-posta adresi girin.',
                });
                return;
            }
            if (createdata.phone_number && !validatePhoneNumber(createdata.phone_number)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Geçersiz Telefon Numarası',
                    text: 'Lütfen geçerli bir telefon numarası girin.',
                });
                return;
            }

            if (!createdata.library_name || !createdata.library_working_start_time || !createdata.library_working_end_time || !createdata.location) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Eksik Bilgi',
                    text: 'Lütfen tüm alanları doldurun.',
                });
                return;
            }
            const response = await libraryService.createlibrary({
                "library_name": createdata.library_name,
                "library_working_start_time": createdata.library_working_start_time ? dayjs(createdata.library_working_start_time).format('HH:mm') : null,
                "library_working_end_time": createdata.library_working_end_time ? dayjs(createdata.library_working_end_time).format('HH:mm') : null,
                "location": createdata.location,
                "location_google_map_adress": createdata.location_google_map_adress,
                "library_email": createdata.library_email,
                "phone_number": createdata.phone_number
            });
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message || 'Başarılı',
                    text: 'Kütüphane başarıyla oluşturuldu.',
                });
                setCreateData({});
                refrestdata();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: response.data.message || 'Kütüphane oluşturulamadı.',
                });
            }
        }
        catch (error) {
            console.error("Error creating library:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kütüphane oluşturulamadı.',
            });
        }
    }
    return (
        <>
            <Container>
                <Box sx={{ mt: 4, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kütüphane Adı"
                                variant="outlined"
                                value={createdata.library_name || ''}
                                onChange={(e) => setCreateData({ ...createdata, library_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Açılış Saati"
                                    value={createdata.library_working_start_time || null}
                                    onChange={(newValue) => setCreateData({ ...createdata, library_working_start_time: newValue })}
                                    views={['hours', 'minutes']}
                                    ampm={false}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Kapanış Saati"
                                    value={createdata.library_working_end_time || null}
                                    onChange={(newValue) => setCreateData({ ...createdata, library_working_end_time: newValue })}
                                    views={['hours', 'minutes']}
                                    ampm={false}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Lokasyon"
                                variant="outlined"
                                value={createdata.location || ''}
                                onChange={(e) => setCreateData({ ...createdata, location: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Lokasyon Google Adresi"
                                variant="outlined"
                                value={createdata.location_google_map_adress || ''}
                                onChange={(e) => setCreateData({ ...createdata, location_google_map_adress: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon Numarası (+90)"
                                variant="outlined"
                                value={createdata.phone_number || ''}
                                onChange={(e) => setCreateData({ ...createdata, phone_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Elektronik Posta"
                                variant="outlined"
                                value={createdata.library_email || ''}
                                onChange={(e) => setCreateData({ ...createdata, library_email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => createdatafunction()}
                                >
                                    Oluştur
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}


export default CreateLibrary;