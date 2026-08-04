import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import LendingBookService from '../../services/LendingBook';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { formatCurrency } from '../../utils/helper.js';
import CustomerUserService from '../../services/CustomerUserService.js';
const lendingBookService = new LendingBookService();
const customerUserService = new CustomerUserService();
const LendingBook = () => {
    const [data, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState('');
    const [bookList, setBookList] = useState([]);
    const [oduncalan, setOduncalan] = useState('');
    const [oduncAlmaTarihi, setOduncAlmaTarihi] = useState(dayjs());
    const [CustomerUsers, setCustomerUsers] = useState([]);
    const { t } = useTranslation();


    const ListCustomerUsers = async () => {
        try {
            const response = await customerUserService.ListCustomerUsers();
            if (response) {
                setCustomerUsers(response.data);
            }
        }
        catch (error) {
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_loading_customer_users'),
                icon: 'error'
            });
        }
    }
    const getBooks = async () => {
        try {
            setLoading(true);
            const response = await lendingBookService.getLendingBooks();
            setBooks(response || []);
            setBookList(response || []);
        } catch (error) {
            console.error('Error fetching books:', error);
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_loading_books'),
                icon: 'error'
            });
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }
    // const getBookList = async () => {
    //     try {
    //         const response = await bookService.getBooks({});
    //         if (response) {
    //             setBookList(response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching books:', error);
    //         Swal.fire({
    //             title: 'Hata',
    //             text: error?.response?.data?.message || 'Kitaplar yüklenirken bir hata oluştu.',
    //             icon: 'error'
    //         });
    //     }
    // }
    const handleLendBook = async () => {
        if (selectedBook === '' || oduncalan === '' || oduncAlmaTarihi.value === '') {
            Swal.fire({
                title: t('error'),
                text: t('please_fill_all_fields'),
                icon: 'error'
            });
            return;
        }
        try {
            const response = await lendingBookService.lendBook({ id: selectedBook, customer_id: oduncalan, odunc_alma_tarihi: oduncAlmaTarihi });
            if (response) {
                Swal.fire({
                    title: t('success'),
                    text: response?.data?.message || t('book_lent_successfully'),
                    icon: 'success'
                });
                getBooks();
                setOduncalan('');
                setOduncAlmaTarihi(dayjs());
            }
        }
        catch (error) {
            console.error('Error lending book:', error);
            Swal.fire({
                title: t('error'),
                text: error?.response?.data?.message || t('error_lending_book'),
                icon: 'error'
            });
        }
    }
    const columns = [
        { field: 'id', headerName: t('id'), width: 90 },
        { field: 'kitap_adi', headerName: t('book_name'), width: 200, flex: 1 },
        { field: 'author_name', headerName: t('author_name_surname'), width: 150, flex: 1 },
        { field: 'kitap_tur', headerName: t('book_type'), width: 150, flex: 1 },
        { field: 'isbn', headerName: t('isbn'), width: 150, flex: 1 },
        {
            field: 'daily_lending_fee',
            headerName: t('daily_lending_fee'),
            width: 150,
            renderCell: (params) => {
                return formatCurrency(params.value);
            }

        },
        {
            field: 'durum',
            headerName: t('status'),
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value === true}
                    disabled
                />
            )
        }
    ];
    useEffect(() => {
        getBooks();
        ListCustomerUsers();
    }, []);
    return (
        <div>
            <Container maxWidth="xl">
                <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('lending_book_title')}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" textAlign="left">
                        {t('lending_book_subtitle')}
                    </Typography>
                </Box>

                <Grid container spacing={2} display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="medium" sx={{ minWidth: '300px' }}>
                            <InputLabel id="book-select-label">{t('select_book')}</InputLabel>
                            <Select
                                labelId="book-select-label"
                                id="book-select"
                                value={selectedBook}
                                label={t('select_book')}
                                onChange={(e) => setSelectedBook(e.target.value)}
                                sx={{
                                    height: '56px',
                                    '& .MuiSelect-select': {
                                        fontSize: '1.1rem',
                                        padding: '14px'
                                    }
                                }}
                            >
                                {bookList.map((book) => (
                                    <MenuItem
                                        key={book.id}
                                        value={book.id}
                                        sx={{
                                            fontSize: '1.1rem',
                                            padding: '12px'
                                        }}
                                    >
                                        {`${book.kitap_adi} - ${t('daily_fee')}: ${formatCurrency(book.daily_lending_fee)}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="medium" sx={{ minWidth: '300px' }}>
                            <InputLabel id="customer-user-select-label">{t('lending_user')}</InputLabel>
                            <Select
                                labelId="customer-user-select-label"
                                id="customer-user-select"
                                value={oduncalan}
                                label={t('lending_user')}
                                onChange={(e) => setOduncalan(e.target.value)}
                                sx={{
                                    height: '56px',
                                    '& .MuiSelect-select': {
                                        fontSize: '1.1rem',
                                        padding: '14px'
                                    }
                                }}
                            >
                                {CustomerUsers.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        value={user.id}
                                        sx={{
                                            fontSize: '1.1rem',
                                            padding: '12px'
                                        }}
                                    >
                                        {`${user.name_surname} - ${t('phone')}: +90${user.phone_number}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                            <DatePicker
                                label={t('lending_date')}
                                value={oduncAlmaTarihi}
                                onChange={(newValue) => setOduncAlmaTarihi(newValue)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-input': {
                                        height: '24px',
                                        fontSize: '1.1rem',
                                        padding: '14px'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLendBook}
                            sx={{
                                height: '56px',
                                fontSize: '1.1rem'
                            }}
                        >
                            {t('lend_button')}
                        </Button>
                    </Grid>
                </Grid>
                <Paper elevation={3} sx={{ width: '100%', mb: 4, p: 2 }}>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                            disableColumnSorting
                            loading={loading}
                            components={{
                                Toolbar: GridToolbar
                            }}
                            sx={{
                                boxShadow: 2,
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
        </div>
    )
}

export default LendingBook;
