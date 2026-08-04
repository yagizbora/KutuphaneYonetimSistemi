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
import { useTranslation } from 'react-i18next';



const Libraries = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const columns = [
        { field: 'id', headerName: t('id'), width: 90, sortable: false, },
        { field: 'library_name', headerName: t('library_name'), width: 150, sortable: false, },
        { field: 'library_working_start_time', headerName: t('opening_date'), width: 150, type: 'Date', sortable: false, },
        { field: 'library_working_end_time', headerName: t('closing_date'), width: 180, type: 'Date', sortable: false, },
        {
            field: 'phone_number', headerName: t('phone_number'), width: 150, sortable: false,
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
        { field: 'location', headerName: t('location'), width: 150, sortable: false, },
        {
            field: 'location_google_map_adress', headerName: t('location_address'), width: 200, sortable: false,
            renderCell: (params) => (
                <>
                    {params.row.location_google_map_adress ? (
                        <a href={params.row.location_google_map_adress} target="_blank" rel="noopener noreferrer">
                            {t('address')}
                        </a>
                    ) : null}
                </>
            )
        },
        {
            field: 'library_email', headerName: t('email'), width: 200, sortable: false,
            renderCell: (params) => (
                <>
                    {params.row.library_email ? (
                        <a href={`mailto:${params.row.library_email}`} rel="noopener noreferrer">
                            {params.row.library_email}
                        </a>
                    ) : null}
                </>
            )
        },
        {
            field: 'actions',
            headerName: t('actions'),
            minWidth: 250,
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
                                    title: t('delete_library'),
                                    text: t('are_you_sure_delete_library'),
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: t('yes_delete'),
                                    cancelButtonText: t('cancel')
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deletedata(params.row.id);
                                    }
                                });
                            }}
                        >
                            {t('delete')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                navigate(`/libraries/edit/${params.row.id}`);
                            }}
                        >
                            {t('edit')}
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
                title: t('error'),
                text: t('error_fetching_libraries'),
            });
        }
    }

    const deletedata = async (data) => {
        try {
            const response = await libraryService.deletelibrary(data);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: response.data.message || t('library_deleted_successfully'),
                });
                getdata();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: t('error'),
                    text: response.data.message || t('error_deleting_library'),
                });
            }
        }
        catch (error) {
            console.error("Error deleting library:", error);
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error.response?.data?.message || t('error_deleting_library'),
            });
        }
    }

    return (
        <>
            <Container >
                <Typography variant="h4" gutterBottom>
                    {t('libraries')}
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

