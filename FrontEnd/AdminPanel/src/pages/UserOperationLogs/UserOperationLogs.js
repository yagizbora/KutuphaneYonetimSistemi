import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import Swal from 'sweetalert2';
import LogService from "../../services/LogService.js";
import { DataGrid } from '@mui/x-data-grid';

const logservice = new LogService();

const UserOperationLogs = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [eventdata, setEventData] = useState([]);
    const [event, setEvent] = useState('');

    const getdata = async () => {
        try {
            const response = await logservice.UserOperationLogs({});
            if (response && Array.isArray(response.data)) {
                setData(response.data);
                setEventData(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
                icon: 'error'
            });
        }
    }

    const getfilterdata = async (event) => {
        try {
            const response = await logservice.UserOperationLogs({ event });
            if (response && Array.isArray(response.data)) {
                setData(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('an_error_occurred'),
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
                    {t('user_operation_logs')}
                </Typography>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">{t('event')}</InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={event}
                            label={t('event')}
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


                <DataGrid
                    rows={data}
                    columns={[
                        { field: 'id', headerName: t('id'), width: 70 },
                        { field: 'event', headerName: t('event_col'), width: 200 },
                        { field: 'event_description', headerName: t('event_description'), width: 1000 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                    getRowId={(row) => row.id}
                />
            </Paper>
        </Container>
    )
};

export default UserOperationLogs;
