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
import { DataGrid } from '@mui/x-data-grid';


const PaymentLogsDataTable = ({ data }) => {


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'kitap_adi', headerName: 'Kitap Adı', width: 200 },
        { field: 'payment_amount', headerName: 'Tutar (₺)', width: 120, type: 'number' },
        { field: 'payment_type', headerName: 'Ödeme Türü', width: 120 },
        { field: 'payment_is_success', headerName: 'Başarılı mı?', width: 130, type: 'boolean' },
        {
            field: 'payment_date', headerName: 'Ödeme Tarihi', width: 180, valueFormatter: (params) => {
                if (!params.value) {
                    return 'Tarih yok';
                }
                const date = new Date(params.value);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            }
        },
        { field: 'payment_failed_subject', headerName: 'Hata Mesajı', width: 250 },
    ];


    return (
        <DataGrid
            rows={data}
            columns={columns}
        >

        </DataGrid>
    )

}

export default PaymentLogsDataTable;