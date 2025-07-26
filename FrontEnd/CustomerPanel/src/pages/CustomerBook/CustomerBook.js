import React, { useEffect, useState } from 'react';
import CustomerBookService from '../../services/CustomerBookService';
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
    FormControl,
    InputLabel,
    FormControlLabel,
    Typography,
    Paper,
    Alert,
    Grid,
    Select,
    MenuItem,
    Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
const customerBookService = new CustomerBookService();

const CustomerBook = () => {

    const [customerBooks, setCustomerBooks] = useState([]);

    const getdata = async () => {
        try {
            const response = await customerBookService.getAllCustomerBooks();
            setCustomerBooks(response.data.data);
            console.log("Customer Books:", response.data);
        } catch (error) {
            console.error("Error fetching customer books:", error);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'kitap_adi', headerName: 'Kitap Adı', width: 200 },
        { field: 'author_name', headerName: 'Yazar', width: 180 },
        { field: 'library_name', headerName: 'Kütüphane', width: 200 },
        { field: 'location', headerName: 'Lokasyon', width: 250 },
        {
            field: 'durum',
            headerName: 'Durum',
            width: 120,
            renderCell: (params) => (
                params.value ? 'Uygun' : 'Değil'
            )
        }
    ];

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Kitap Listesi
                    </Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <DataGrid
                            rows={customerBooks}
                            columns={columns}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            checkboxSelection
                        />
                    </Paper>
                </Box>
            </Container>
        </>
    )
}


export default CustomerBook;