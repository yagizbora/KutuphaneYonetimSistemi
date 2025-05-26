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
import dayjs from 'dayjs';


const PaymentLogsDataTable = ({ data, index }) => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'kitap_adi', headerName: 'Kitap Adı', width: 200 },
        {
            field: 'payment_amount',
            headerName: 'Tutar (₺)',
            width: 120,
            type: 'de',
            valueFormatter: (params) => {
                const value = params;
                if (value === null || value === undefined) {
                    return 'Tutar yok';
                }

                const newvalue = Math.round(value * 100) / 100;

                const formatter = new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                return formatter.format(newvalue);
            }
        },
        { field: 'payment_type', headerName: 'Ödeme Türü', width: 120 },
        { field: 'payment_is_success', headerName: 'Başarılı mı?', width: 130, type: 'boolean' },
        {
            field: 'payment_date',
            headerName: 'Ödeme Tarihi',
            width: 160,
            valueFormatter: (params) => {
                if (!params) return 'Tarih yok';
                const date = dayjs(params.value);
                return date.format('DD.MM.YYYY');
            }
        },
    ];

    const activecolumns = [
        ...columns,
        { field: 'payment_failed_subject', headerName: 'Hata Mesajı', width: 250 },

    ]


    return (
        <DataGrid
            rows={data}
            columns={index === 0 ? columns : activecolumns}

        >
        </DataGrid>
    )

}

export default PaymentLogsDataTable;