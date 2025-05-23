import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Checkbox,
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
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import LogService from "../../services/LogService.js";
import { DataGrid } from '@mui/x-data-grid';

const logservice = new LogService();


const UserLoginOperationLogs = () => {
    const [data, setData] = useState([]);
    const [event, setEvent] = useState('');

    const getdata = async () => {
        const response = await logservice.UserLoginOperationLogs({});
        if (response) {
            setData(response.data);
        }
    }

    useEffect(() => {
        getdata();
    }, []);
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Kullanıcı Giriş Logları
                </Typography>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <p>Event</p>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={event}
                        onChange={(e) => setEvent(e.target.value)}
                    >
                        {[...new Set(data.map((item) => item.event))].map((uniqueEvent) => (
                            <MenuItem key={uniqueEvent} value={uniqueEvent}>
                                {uniqueEvent}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                />
            </Paper>
        </Container>
    )
};



export default UserLoginOperationLogs;