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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import LibraryService from '../../../services/LibraryService.js';

const editLibraries = () => {
    const libraryService = new LibraryService();
    const [editdata, setEditData] = useState({
        library_name: '',
        library_working_start_time: null,
        library_working_end_time: null
    })

    const { id } = useParams();
    useEffect(() => {
        if (!id) {
            window.history.back();
        }
        else {
            getdata()
        }
    }, [id])

    const getdata = async () => {
        try {
            const response = await libraryService.GetLibrariesbyid(id);
            setEditData({
                ...response.data.data[0],
                library_working_start_time: dayjs(response.data.data[0].library_working_start_time, 'HH:mm:ss'),
                library_working_end_time: dayjs(response.data.data[0].library_working_end_time, 'HH:mm:ss')
            });
            console.log("Library data fetched successfully:", response.data.data);
            console.log("Edit data state updated:", editdata);
        } catch (error) {
            console.error("Error fetching library data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kütüphane verileri alınamadı.',
            });
        }
    }

    const createdatafunction = async () => {
        try {
            const response = await libraryService.editLibraries({
                "id": id,
                "library_name": editdata.library_name,
                "library_working_start_time": editdata.library_working_start_time ? dayjs(editdata.library_working_start_time).format('HH:mm') : null,
                "library_working_end_time": editdata.library_working_end_time ? dayjs(editdata.library_working_end_time).format('HH:mm') : null
            });
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: response.data.message || 'Kütüphane başarıyla oluşturuldu.',
                });
                setEditData({});
                window.history.back();
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
                                value={editdata.library_name || ''}
                                onChange={(e) => setEditData({ ...editdata, library_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Açılış Saati"
                                    value={editdata.library_working_start_time || null}
                                    onChange={(newValue) => setEditData({ ...editdata, library_working_start_time: newValue })}
                                    views={['hours', 'minutes']}
                                    ampm={false}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Kapanış Saati"
                                    value={editdata.library_working_end_time || null}
                                    onChange={(newValue) => setEditData({ ...editdata, library_working_end_time: newValue })}
                                    views={['hours', 'minutes']}
                                    ampm={false}
                                />
                            </LocalizationProvider>
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


export default editLibraries;