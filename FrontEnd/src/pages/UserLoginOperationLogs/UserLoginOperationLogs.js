import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    FormControl,
    Pagination,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import Swal from 'sweetalert2';
import LogService from "../../services/LogService.js";
import { DataGrid } from '@mui/x-data-grid';

const logservice = new LogService();

const UserLoginOperationLogs = () => {
    const [data, setData] = useState([]);
    const [eventdata, setEventData] = useState([]);
    const [event, setEvent] = useState('');
    const [pagination, setPagination] = useState({
        totalPages: 0,
        currentPage: 1,
        count: 0
    });

    const getdata = async () => {
        try {
            const response = await logservice.UserLoginOperationLogs({
                count: 10,
            });
            if (response && Array.isArray(response.data.data)) {
                setData(response.data.data);
                setEventData(response.data.data);
                setPagination({
                    totalPages: Math.ceil(response.data.count / 10),
                    currentPage: 1,
                    count: response.data.count
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error'
            });
        }
    }
    const handlePageChange = async (e, value) => {
        setPagination(prev => ({ ...prev, currentPage: value }));
        try {
            const response = await logservice.UserLoginOperationLogs({
                event,
                count: 10,
                page: value
            });
            if (response && Array.isArray(response.data.data)) {
                setData(response.data.data);
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error'
            });
        }
    }


    const getfilterdata = async (event) => {
        try {
            const response = await logservice.UserLoginOperationLogs({ event });
            if (response && Array.isArray(response.data.data)) {
                setData(response.data.data);
            }
        } catch (error) {
            Swal.fire({
                title: 'Hata',
                text: error?.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error'
            });
        }
    }

    useEffect(() => {
        getdata();
    }, []);

    useEffect(() => {
        if (event) {
            getfilterdata(event);
        } else {
            getdata();
        }
    }, [event]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Kullanıcı Giriş Logları
                </Typography>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">Event</InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={event}
                            label="Event"
                            onChange={(e) => setEvent(e.target.value)}
                            sx={{ flexGrow: 1 }}
                        >
                            {[...new Set(eventdata.map((item) => item.event))].map((uniqueEvent) => (
                                <MenuItem key={uniqueEvent} value={uniqueEvent}>
                                    {uniqueEvent}
                                </MenuItem>
                            ))}
                        </Select>
                        <IconButton
                            aria-label="clear filter"
                            onClick={() => setEvent('')}
                            sx={{ ml: 1 }}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </FormControl>
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Toplam Kayıt: {pagination.count}
                    </Typography>
                    <DataGrid
                        rows={data}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 70 },
                            { field: 'event', headerName: 'Olay', width: 200 },
                            { field: 'event_description', headerName: 'Olay Açıklaması', width: 1000 },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        autoHeight
                        hideFooter
                        getRowId={(row) => row.id}
                    />
                    <Box row="auto" display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={handlePageChange}
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
};

export default UserLoginOperationLogs;
