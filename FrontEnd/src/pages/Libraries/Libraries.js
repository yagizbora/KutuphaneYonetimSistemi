import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import LibraryService from '../../services/LibraryService.js';
import LibraryTable from './LibraryTables/LibraryTable.js';
import CreateLibrary from './CreateLibrary/CreateLibrary.js';



const Libraries = () => {
    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, sortable: false, },
        { field: 'library_name', headerName: 'Kütüphane Adı', width: 150, sortable: false, },
        { field: 'library_working_start_time', headerName: 'Açılış Tarihi', width: 150, type: 'Date', sortable: false, },
        { field: 'library_working_end_time', headerName: 'Kapanış Tarihi', width: 180, type: 'Date', sortable: false, },
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
            field: 'actions',
            headerName: 'İşlemler',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                Swal.fire({
                                    title: 'Kütüphane Sil',
                                    text: "Bu kütüphaneyi silmek istediğinize emin misiniz?",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Evet, sil!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deletedata(params.row.id);
                                    }
                                });
                            }}
                        >
                            Sil
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                navigate(`/libraries/edit/${params.row.id}`);
                            }}
                        >
                            Düzenle
                        </Button>
                    </Stack>
                </>
            )
        }
    ];
    const libraryService = new LibraryService();
    const [data, setData] = useState([]);

    useEffect(() => {
        getdata();
    }, []);

    const getdata = async () => {
        try {
            const response = await libraryService.GetLibraries();
            setData(response.data.data);

        }
        catch (error) {
            console.error("Error fetching libraries:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kütüphaneler alınırken bir hata oluştu.',
            });
        }
    }

    const deletedata = async (data) => {
        try {
            const response = await libraryService.deletelibrary(data);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: response.data.message || 'Kütüphane başarıyla silindi.',
                });
                getdata();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: response.data.message || 'Kütüphane silinirken bir hata oluştu.',
                });
            }
        }
        catch (error) {
            console.error("Error deleting library:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: error.response.data.message || 'Kütüphane silinirken bir hata oluştu.',
            });
        }
    }

    return (
        <>
            <Container >
                <Typography variant="h4" gutterBottom>
                    Kütüphaneler
                </Typography>
                <Grid
                    container
                    direction="row"
                    sx={{
                        backgroundColor: "#f5f5f5",
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <CreateLibrary refrestdata={getdata} />
                    </Box>
                </Grid>
                <Paper sx={{ p: 2, width: '100%', overflow: 'hidden', marginTop: 2 }}>
                    <LibraryTable columns={columns} data={data} />
                </Paper>
            </Container>
        </>
    )
}


export default Libraries;

