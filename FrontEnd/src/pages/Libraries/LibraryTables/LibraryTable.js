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

const LibraryTable = ({ data, columns }) => {

    return (
        <>
            <DataGrid
                rows={data}
                columns={columns}
                checkboxSelection={false}
                autoHeight
                disableRowSelectionOnClick
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </>
    )
}


export default LibraryTable;