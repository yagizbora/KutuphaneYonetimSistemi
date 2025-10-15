import React, { useEffect, useState } from 'react';
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
import LibraryService from '../../services/LibraryService';
const libraryService = new LibraryService();

const Library = () => {
    const [libraries, setLibraries] = useState([]);


    const getdata = async () => {
        try {
            const response = await libraryService.getAllLibrariesForCustomers();
            if (response) {
                setLibraries(response.data.data);
                console.log("Libraries:", response.data.data);
            }
        }
        catch (error) {
            console.error("Error fetching libraries:", error);
            Swal.fire({
                title: 'Hata',
                text: 'Kütüphaneler getirilirken bir hata oluştu.' || error.message,
                icon: 'error'
            })
        }
    }


    const columns = [
        { field: 'id', headerName: 'ID', width: 90, sortable: false, },
        { field: 'library_name', headerName: 'Kütüphane Adı', width: 150, sortable: false, },
        { field: 'library_working_start_time', headerName: 'Açılış Tarihi', width: 150, type: 'Date', sortable: false, },
        { field: 'library_working_end_time', headerName: 'Kapanış Tarihi', width: 180, type: 'Date', sortable: false, },
        {
            field: 'phone_number', headerName: 'Telefon Numarası', width: 150, sortable: false,
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
        { field: 'location', headerName: 'Konum', width: 150, sortable: false, },
        {
            field: 'location_google_map_adress', headerName: 'Konum Adresi', width: 200, sortable: false,
            renderCell: (params) => (
                <>
                    {params.row.location_google_map_adress ? (
                        <a href={params.row.location_google_map_adress} target="_blank" rel="noopener noreferrer">
                            Adres
                        </a>
                    ) : null}
                </>
            )
        },
        {
            field: 'library_email', headerName: 'Elektronik Posta', width: 200, sortable: false,
            renderCell: (params) => (
                <>
                    {params.row.library_email ? (
                        <a href={`mailto:${params.row.library_email}`} rel="noopener noreferrer">
                            {params.row.library_email}
                        </a>
                    ) : null}
                </>
            )
        }
    ];

    useEffect(() => {
        getdata();
    }, []);

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper>
                    <Box>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{ p: 2 }}>
                            Kütüphaneler
                        </Typography>
                    </Box>
                </Paper>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: '100%', mt: 2 }}>
                    <Box sx={{ height: 900, width: '100%' }}>
                        <DataGrid
                            rows={libraries}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            sx={{
                                boxShadow: 2,
                                width: '100%',
                                border: 2,
                                borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </Container>
        </>
    )
}


export default Library;