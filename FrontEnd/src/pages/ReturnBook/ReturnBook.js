import React, { useState, useEffect } from 'react';
import './ReturnBook.css';
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
    FormControlLabel,
    Typography,
    Paper,
    Alert,
    Stack,
    Grid,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogContentText from '@mui/material/DialogContentText';
import Swal from 'sweetalert2';
import ReturnBookService from '../../services/ReturnBookService';


const returnbookservice = new ReturnBookService();

const ReturnBook = () => {

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            editable: false,
        },
        {
            field: 'kitap_adi',
            headerName: 'Kitap Adı',
            width: 150,
            editable: false,
        },
        {
            field: 'Durum',
            headerName: 'Durum',
            width: 150,
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <Checkbox
                            checked={params.row.durum === 'false'}
                            disabled
                            color="primary"
                        >

                        </Checkbox>
                    </div>
                );
            },
        },
        {
            field: 'odunc_alan',
            headerName: 'Ödünç Alan',
            width: 150,
            editable: false,
        },
        {
            field: 'odunc_alma_tarihi',
            headerName: 'Tarih',
            width: 150,
            flex: 1,
            valueFormatter: (params) => {
                if (!params) return '';
                try {
                    const date = new Date(params);
                    if (isNaN(date.getTime())) return '';

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');

                    return `${day}.${month}.${year} ${hours}:${minutes}`;
                } catch {
                    return '';
                }
            }
        }
    ]

    const [data, setData] = useState([]);

    const getreturnbook = async () => {
        const response = await returnbookservice.getReturnBook();
        setData(response.data);
    }
    useEffect(() => {
        getreturnbook();
    }, [])

    return (
        <div className="ReturnBook">
            <Container maxWidth="lg" sx={{ marginTop: 2 }}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Kitap İade İşlemleri
                    </Typography>

                    <Paper spacing={2}>
                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    components={{ Toolbar: GridToolbar }}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            </Paper>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </div>

    );
}


export default ReturnBook;