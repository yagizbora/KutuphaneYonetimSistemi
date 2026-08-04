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
    Typography,
    Paper,
    Alert,
    Stack,
    Grid,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentsIcon from '@mui/icons-material/Payments';
import DialogContentText from '@mui/material/DialogContentText';
import Swal from 'sweetalert2';
import ReturnBookService from '../../services/ReturnBookService';
import { useTranslation } from 'react-i18next';

const returnbookservice = new ReturnBookService();


function CustomNoRowsOverlay() {
    const { t } = useTranslation();
    return (
        <Box sx={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Alert severity="info">{t('no_book_found')}</Alert>
        </Box>
    );
}


const ReturnBook = () => {
    const { t } = useTranslation();

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            editable: false,
        },
        {
            field: 'kitap_adi',
            headerName: t('book_name_col'),
            width: 150,
            editable: false,
        },
        {
            field: 'Durum',
            headerName: t('status'),
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
            field: 'name_surname',
            headerName: t('borrower_col'),
            width: 150,
            editable: false,
        },
        {
            field: 'odunc_alma_tarihi',
            headerName: t('date_col'),
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
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            }
        },
        {
            field: 'İşlemler',
            headerName: t('actions'),
            sortable: false,
            width: 269,
            editable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} justifyContent="left" alignItems="center">
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        startIcon={<PaymentsIcon />}
                        sx={{ backgroundColor: 'green' }}
                        onClick={() => calculateFine(params.row)}
                    >
                        {t('open_payment_screen')}
                    </Button>
                </Stack>
            )

        }
    ]

    const [data, setData] = useState([]);
    const [openeditdialog, setOpeneditdialog] = useState(false);
    const [paymentdata, setPaymentdata] = useState({
        id: null,
        "calculatedDelayAllowance": "",
        "geri_alma_tarihi": null,
        "payment_amount": "",
        "payment_type": "",
        "receipt_no": ""

    });

    const calculateFine = async (data) => {
        try {
            setPaymentdata({
                id: null,
                "calculatedDelayAllowance": "",
                "geri_verme_tarihi": dayjs(),
                "payment_amount": "",
                "payment_type": "",
                "receipt_no": ""
            })

            const response = await returnbookservice.CalculateBookLending({
                id: data.id
            });
            if (response) {

                setPaymentdata((prevData) => ({
                    ...prevData,
                    calculatedDelayAllowance: response.data.data.calculatedDelayAllowance,
                    id: data.id
                }))
                setOpeneditdialog(true);
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: t('error_occurred'),
            });
        }
    }
    const getreturnbook = async () => {
        const response = await returnbookservice.getReturnBook();
        setData(response.data);
    }

    const returnbook = async () => {
        try {
            const response = await returnbookservice.ReturnBook({ ...paymentdata });
            if (response.data.status || response) {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: response.data.messsage || t('book_returned_successfully'),
                });
                setOpeneditdialog(false);
                getreturnbook();
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: error?.response?.data?.message || t('error_occurred'),
            });
            setOpeneditdialog(false);
        }


    }

    const recalculateFine = async (data) => {
        try {
            const response = await returnbookservice.CalculateBookLending({
                id: data.id,
                "geri_alma_tarihi": data.odunc_alma_tarihi
            });
            if (response) {

                setPaymentdata((prevData) => ({
                    ...prevData,
                    calculatedDelayAllowance: response.data.data.calculatedDelayAllowance,
                }))

            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: t('error_occurred'),
            });
        }
    }

    useEffect(() => {
        getreturnbook();
    }, [])

    return (
        <div className="ReturnBook">
            <Container maxWidth="lg" sx={{ marginTop: 2 }}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        {t('book_return_operations')}
                    </Typography>

                    <Paper spacing={2}>
                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    slots={{
                                        noRowsOverlay: CustomNoRowsOverlay
                                    }}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            </Paper>
                        </Stack>
                    </Paper>
                </Box>
            </Container>

            <Dialog
                open={openeditdialog}
                onClose={() => setOpeneditdialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t('book_payment_screen')}</DialogTitle>
                <DialogContent>
                    <div className="dialog-container">
                        <Grid container spacing={2}>

                            {/* Ödenicek minimum Tutar */}
                            <Grid item xs={12} md={4}>
                                <p>{t('minimum_amount_to_pay')}</p>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={paymentdata.calculatedDelayAllowance}
                                />
                            </Grid>

                            {/* Ödeme Türü */}
                            <Grid item xs={12} md={4}>
                                <p>{t('payment_type')}</p>
                                <FormControl sx={{ width: 300, }}>
                                    <Select
                                        fullWidth
                                        type="number"
                                        placeholder={t('paid_amount')}
                                        value={paymentdata.payment_type}
                                        onChange={(e) =>
                                            setPaymentdata({ ...paymentdata, payment_type: e.target.value })
                                        }
                                    >
                                        <MenuItem value={"Yok"}>{t('none')}</MenuItem>
                                        <MenuItem value={"Kart"}>{t('card')}</MenuItem>
                                        <MenuItem value={"Nakit"}>{t('cash')}</MenuItem>
                                        <MenuItem value={"Hediye Çeki"}>{t('gift_card')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Ödünç Verme Tarihi */}
                            <Grid item xs={12} md={4}>
                                <p>{t('lending_date')}</p>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["DatePicker"]}>
                                        <DatePicker
                                            label={t('select_date')}
                                            value={paymentdata.geri_verme_tarihi}
                                            onChange={async (newValue) => {
                                                const updatedData = {
                                                    ...paymentdata,
                                                    geri_verme_tarihi: newValue,
                                                };
                                                setPaymentdata(updatedData);

                                                const recalculateFinedata = {
                                                    id: paymentdata.id,
                                                    odunc_alma_tarihi: newValue
                                                };
                                                recalculateFine(recalculateFinedata);
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            {/* Ödenen Miktar */}
                            <Grid item xs={12} md={4}>
                                <p>{t('paid_amount')}</p>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder={t('paid_amount')}
                                    value={paymentdata.payment_amount}
                                    onChange={(e) =>
                                        setPaymentdata({ ...paymentdata, payment_amount: e.target.value })
                                    }
                                />
                            </Grid>

                            {/* Fiş No */}
                            <Grid item xs={12} md={4}>
                                <p>{t('receipt_no')}</p>
                                <TextField
                                    fullWidth
                                    placeholder={t('receipt_no')}
                                    value={paymentdata.receipt_no}
                                    onChange={(e) =>
                                        setPaymentdata({ ...paymentdata, receipt_no: e.target.value })
                                    }
                                />
                            </Grid>

                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => returnbook(false)}
                        variant="outlined"
                        sx={{ margin: 1 }}
                    >{t('make_payment')}</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}


export default ReturnBook;