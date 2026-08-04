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
import { useTranslation } from 'react-i18next';

const logservice = new LogService();

const PaymentLogs = () => {
    const { t } = useTranslation();

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
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
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
                    {t('payment_logs')}
                </Typography>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
                    <Tab label={t('completed_payments')} />
                    <Tab label={t('uncompleted_payments')} />
                </Tabs>

                <PaymentLogsDataTable data={data} index={tabIndex} />
            </Paper>
        </Container>
    )
}


export default PaymentLogs;