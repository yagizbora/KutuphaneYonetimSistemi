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





const user = () => {
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
            </Box>
        </Container>

    );

}



export default user;