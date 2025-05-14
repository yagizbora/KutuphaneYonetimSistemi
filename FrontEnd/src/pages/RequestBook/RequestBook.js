import React, { useState, useEffect } from 'react';
import {
    Container,
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
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RequestService from '../../services/RequestService.js';

const requestservice = new RequestService();

const RequestBook = () => {

    const getrequests = async () => {
        try {
            const response = await requestservice.getbookrequest();
            if (response) {
                console.log(response)
            }
        }
        catch (error) {

        }
    }

    useEffect(() => {
        getrequests();
    }, [])


    return (
        <Grid container spacing={2}>
            <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kitap İstekleri Listesi
                </Typography>
            </Box>
            <Grid size={{ xs: 6, md: 8 }}>
            </Grid>
        </Grid>
    )
}


export default RequestBook;