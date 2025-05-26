import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Checkbox,
    Table,
    Tabs,
    Tab,
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
    const [tabIndex, setTabIndex] = useState(0);

    const getdata = async (index) => {
        try {
            let status = null;
            if (index === 0) status = true;
            else if (index === 1) status = false;

            const response = await logservice.PaymentLogs({
                payment_is_success: status
            });
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
        getdata(tabIndex);
    }, [tabIndex]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Ödeme Logları
                </Typography>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
                    <Tab label="Tamamlanmış Ödemeler" />
                    <Tab label="Tamamlanmamış Ödemeler" />
                </Tabs>

                <PaymentLogsDataTable data={data} index={tabIndex} />
            </Paper>
        </Container>
    )
}


export default PaymentLogs;