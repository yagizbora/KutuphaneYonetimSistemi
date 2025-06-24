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
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import LibraryService from '../../services/LibraryService.js';
import LibraryTable from './LibraryTables/LibraryTable.js';
import CreateLibrary from './CreateLibrary/CreateLibrary.js';



const Libraries = () => {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'library_name', headerName: 'Kütüphane Adı', width: 150 },
        { field: 'library_working_start_time', headerName: 'Açılış Tarihi', width: 150, type: 'Date' },
        { field: 'library_working_end_time', headerName: 'Kapanış Tarihi', width: 180, type: 'Date' },
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
                    <Box sx={{ flexGrow: 1 }}>
                        <CreateLibrary refrestdata={getdata} />
                    </Box>
                </Grid>
                <Paper sx={{ p: 2 }}>
                    <LibraryTable columns={columns} data={data} />
                </Paper>
            </Container>
        </>
    )
}


export default Libraries;

