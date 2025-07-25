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
    InputLabel,
    Stack,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import CustomerUserService from "../../../services/CustomerUserService";

const customerUserService = new CustomerUserService();




const CustomerUserList = () => {
    const [data, setCustomerUsers] = useState({});



    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'tc_kimlik_no', headerName: 'T.C. Kimlik No', width: 150 },
        { field: 'username', headerName: 'Kullanıcı Adı', width: 150 },
        { field: 'name_surname', headerName: 'Ad Soyad', width: 200 },
        {
            field: 'birthday_date', headerName: 'Doğum Tarihi', width: 180, type: 'Date',
            valueGetter: (params) => dayjs(params.value).format('DD/MM/YYYY')
        },
        {
            field: 'phone_number', headerName: 'Telefon', width: 150,
            renderCell: (params) => (
                <>
                    {params.row.phone_number ? (
                        <a href={`tel: +90${params.row.phone_number}`} rel="noopener noreferrer">
                            +90{params.row.phone_number}
                        </a>
                    ) : null}
                </>
            )
        },
        { field: 'eposta', headerName: 'E-posta', width: 200 },
    ];


    useEffect(() => {
        ListCustomerUsers();
    }, []);


    const ListCustomerUsers = async () => {
        try {
            const response = await customerUserService.ListCustomerUsers();
            if (response) {
                setCustomerUsers(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Müşteri kullanıcılar yüklenirken bir hata oluştu.',
                icon: 'error'
            });
        }
    }


    return (
        <>
            <Container>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Müşteri Kullanıcı Listesi
                    </Typography>
                </Box>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        components={{ Toolbar: GridToolbar }}
                    />
                </Paper>
            </Container>
        </>
    )
}


export default CustomerUserList;