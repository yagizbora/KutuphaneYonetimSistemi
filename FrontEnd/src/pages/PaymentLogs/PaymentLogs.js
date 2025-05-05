import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import Swal from 'sweetalert2';
import PaymentLogsDataTable from './PaymentLogsDataTable';
import LogService from "../../services/LogService.js";

const logservice = new LogService();

const PaymentLogs = () => {

    const [data, setPaymentLogs] = useState([]);
    const getdata = async () => {
        try {
            const response = await logservice.PaymentLogs();
            if (response) {
                setPaymentLogs(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error'
            });
        }
    }
    useEffect(() => {
        getdata();
    }, []);
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Ödeme Logları
                </Typography>
                <PaymentLogsDataTable data={data} />
            </Paper>
        </Container>
    )
}


export default PaymentLogs;